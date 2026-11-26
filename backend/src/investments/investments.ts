import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, Injectable, Module, NotFoundException, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { toBase64 } from '../common/base64.js';
import { encryptedPayload, keyVersion, linkedTransaction } from '../common/encrypted.js';
import { isoDate, toIsoDate } from '../common/sync.js';
import type { Asset, InvestmentTransaction, ManualAssetPrice } from '../generated/prisma/client.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { HouseholdsModule } from '../households/households.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

const assetClass = z.enum(['STOCK', 'CEDEAR', 'BOND', 'ETF', 'MUTUAL_FUND', 'CRYPTO', 'STABLECOIN', 'REAL_ESTATE', 'OTHER']);
/** Activo propio del hogar. payload: { symbol, name, market } */
const createAsset = z.object({ id: z.uuid(), assetClass, currency: z.string().trim().toUpperCase().min(3).max(10), payload: encryptedPayload, keyVersion });
/** payload: { price } */
const createPrice = z.object({ id: z.uuid(), assetId: z.uuid(), date: isoDate, payload: encryptedPayload, keyVersion });

/**
 * Operación + movimiento de efectivo en la cuenta de inversión, atómicos.
 * Compra/comisión: sale efectivo (ajuste). Venta: entra (ajuste). Dividendo/interés: ingreso.
 * payload: { quantity, unitPrice, fees, notes }
 */
const createTrade = z.object({
  id: z.uuid(),
  accountId: z.uuid(),
  assetId: z.uuid(),
  type: z.enum(['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE']),
  date: isoDate,
  payload: encryptedPayload,
  keyVersion,
  cash: linkedTransaction.nullable(),
});

const CASH_TYPE = { BUY: 'ADJUSTMENT_OUT', FEE: 'ADJUSTMENT_OUT', SELL: 'ADJUSTMENT_IN', DIVIDEND: 'INCOME', INTEREST: 'INCOME' } as const;

const assetDto = (a: Asset) => ({
  id: a.id,
  householdId: a.householdId,
  assetClass: a.assetClass,
  currency: a.currency,
  symbol: a.symbol,
  name: a.name,
  payload: a.payload ? toBase64(a.payload) : null,
  keyVersion: a.keyVersion,
});
const priceDto = (p: ManualAssetPrice) => ({ id: p.id, assetId: p.assetId, date: toIsoDate(p.date), payload: toBase64(p.payload), keyVersion: p.keyVersion });
const tradeDto = (t: InvestmentTransaction) => ({
  id: t.id,
  accountId: t.accountId,
  assetId: t.assetId,
  cashTransactionId: t.cashTransactionId,
  type: t.type,
  date: toIsoDate(t.date),
  payload: toBase64(t.payload),
  keyVersion: t.keyVersion,
});

@Injectable()
export class InvestmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  /** Todo lo de inversiones del hogar en un solo pedido (son pocos registros). */
  async overview(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const [assets, prices, trades] = await Promise.all([
      this.prisma.asset.findMany({ where: { OR: [{ householdId }, { householdId: null }], deletedAt: null } }),
      this.prisma.manualAssetPrice.findMany({ where: { householdId, deletedAt: null }, orderBy: { date: 'asc' } }),
      this.prisma.investmentTransaction.findMany({ where: { householdId, deletedAt: null }, orderBy: [{ date: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] }), // mismo día: en orden de carga (importa para el costo promedio)
    ]);
    return { assets: assets.map(assetDto), prices: prices.map(priceDto), trades: trades.map(tradeDto) };
  }

  async createAsset(householdId: string, userId: string, input: z.infer<typeof createAsset>) {
    await this.keys(householdId, userId, [input.keyVersion]);
    if (!(await this.prisma.currency.findUnique({ where: { code: input.currency } }))) throw new BadRequestException('Moneda desconocida');
    return assetDto(await this.prisma.asset.create({ data: { ...input, householdId } }));
  }

  async createPrice(householdId: string, userId: string, input: z.infer<typeof createPrice>) {
    await this.keys(householdId, userId, [input.keyVersion]);
    await this.assetOf(householdId, input.assetId);
    return priceDto(await this.prisma.manualAssetPrice.create({ data: { ...input, householdId } }));
  }

  async createTrade(householdId: string, userId: string, input: z.infer<typeof createTrade>) {
    await this.keys(householdId, userId, [input.keyVersion, input.cash?.keyVersion]);
    const account = await this.prisma.account.findFirst({ where: { id: input.accountId, householdId, deletedAt: null } });
    if (!account || account.type !== 'INVESTMENT') throw new BadRequestException('La operación va en una cuenta de inversión del hogar');
    const asset = await this.assetOf(householdId, input.assetId);
    if (asset.currency !== account.currency) throw new BadRequestException('El activo cotiza en otra moneda que la cuenta');
    const cashType = CASH_TYPE[input.type];
    if (input.cash?.categoryId) {
      const cat = await this.prisma.category.findFirst({ where: { id: input.cash.categoryId, householdId, kind: cashType === 'INCOME' ? 'INCOME' : 'EXPENSE', deletedAt: null } });
      if (!cat) throw new BadRequestException('Categoría inexistente o de otro tipo');
    }
    const row = await this.prisma.$transaction(async (tx) => {
      if (input.cash) {
        await tx.transaction.create({
          data: {
            id: input.cash.id,
            householdId,
            accountId: input.accountId,
            categoryId: input.cash.categoryId,
            type: cashType,
            status: 'CLEARED',
            date: input.date,
            createdById: userId,
            payload: input.cash.payload,
            keyVersion: input.cash.keyVersion,
          },
        });
      }
      return tx.investmentTransaction.create({
        data: {
          id: input.id,
          householdId,
          accountId: input.accountId,
          assetId: input.assetId,
          cashTransactionId: input.cash?.id ?? null,
          type: input.type,
          date: input.date,
          payload: input.payload,
          keyVersion: input.keyVersion,
        },
      });
    });
    return tradeDto(row);
  }

  /** Borra la operación y su movimiento de efectivo. */
  async removeTrade(householdId: string, userId: string, id: string) {
    await this.access.require(householdId, userId, 'write');
    await this.prisma.$transaction(async (tx) => {
      const t = await tx.investmentTransaction.findFirst({ where: { id, householdId, deletedAt: null } });
      if (!t) throw new NotFoundException('Operación no encontrada');
      const now = new Date();
      await tx.investmentTransaction.update({ where: { id }, data: { deletedAt: now } });
      if (t.cashTransactionId) await tx.transaction.updateMany({ where: { id: t.cashTransactionId, deletedAt: null }, data: { deletedAt: now } });
    });
  }

  private async assetOf(householdId: string, assetId: string) {
    const a = await this.prisma.asset.findFirst({ where: { id: assetId, OR: [{ householdId }, { householdId: null }], deletedAt: null } });
    if (!a) throw new BadRequestException('Activo inexistente');
    return a;
  }

  private async keys(householdId: string, userId: string, versions: (number | undefined)[]) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (versions.some((v) => v !== undefined && v !== currentKeyVersion)) throw new ConflictException('La clave del hogar cambió; recargá');
  }
}

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/investments')
export class InvestmentsController {
  constructor(private readonly inv: InvestmentsService) {}

  @Get()
  overview(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.inv.overview(hid, uid);
  }

  @Post('assets')
  createAsset(@Param('householdId', uuid) hid: string, @Body({ schema: createAsset }) body: z.infer<typeof createAsset>, @CurrentUser('id') uid: string) {
    return this.inv.createAsset(hid, uid, body);
  }

  @Post('prices')
  createPrice(@Param('householdId', uuid) hid: string, @Body({ schema: createPrice }) body: z.infer<typeof createPrice>, @CurrentUser('id') uid: string) {
    return this.inv.createPrice(hid, uid, body);
  }

  @Post('trades')
  createTrade(@Param('householdId', uuid) hid: string, @Body({ schema: createTrade }) body: z.infer<typeof createTrade>, @CurrentUser('id') uid: string) {
    return this.inv.createTrade(hid, uid, body);
  }

  @Delete('trades/:id')
  @HttpCode(204)
  async removeTrade(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @CurrentUser('id') uid: string) {
    await this.inv.removeTrade(hid, uid, id);
  }
}

@Module({ imports: [HouseholdsModule], controllers: [InvestmentsController], providers: [InvestmentsService] })
export class InvestmentsModule {}
