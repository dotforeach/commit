import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, Injectable, Module, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { deleteQuerySchema } from '../accounts/accounts.schemas.js';
import { toBase64 } from '../common/base64.js';
import { encryptedPayload, keyVersion, linkedTransaction, type LinkedTransaction } from '../common/encrypted.js';
import { isoDate, toIsoDate, revision } from '../common/sync.js';
import type { FixedTermDeposit, Prisma } from '../generated/prisma/client.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { HouseholdsModule } from '../households/households.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** payload: { institution, principal, annualRate } */
const fields = {
  accountId: z.uuid(),
  currency: z.string().trim().toUpperCase().min(3).max(10),
  rateType: z.enum(['FIXED', 'VARIABLE', 'INDEXED', 'NONE']),
  startDate: isoDate,
  maturityDate: isoDate,
  autoRenew: z.boolean(),
  payload: encryptedPayload,
  keyVersion,
};
const datesOk = (d: { startDate: Date; maturityDate: Date }) => d.maturityDate > d.startDate;
const datesMsg = { message: 'El vencimiento tiene que ser posterior a la constitución' };

/** `transaction`: salida del capital de la cuenta (ajuste, no gasto). */
const createDeposit = z.object({ id: z.uuid(), ...fields, transaction: linkedTransaction.nullable() }).refine(datesOk, datesMsg);
const updateDeposit = z.object({ expectedRevision: revision, ...fields }).refine(datesOk, datesMsg);
/** Cobro al vencimiento: vuelve el capital (ajuste) y el interés entra como ingreso. */
const collectDeposit = z.object({
  expectedRevision: revision,
  date: isoDate,
  principal: linkedTransaction,
  interest: linkedTransaction.nullable(),
});

const dto = (d: FixedTermDeposit) => ({
  id: d.id,
  accountId: d.accountId,
  currency: d.currency,
  rateType: d.rateType,
  startDate: toIsoDate(d.startDate),
  maturityDate: toIsoDate(d.maturityDate),
  autoRenew: d.autoRenew,
  status: d.status,
  payload: toBase64(d.payload),
  keyVersion: d.keyVersion,
  revision: d.revision.toString(),
});

@Injectable()
export class DepositsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.fixedTermDeposit.findMany({ where: { householdId, deletedAt: null }, orderBy: { maturityDate: 'asc' } });
    return { items: rows.map(dto) };
  }

  async create(householdId: string, userId: string, input: z.infer<typeof createDeposit>) {
    const kv = await this.validate(householdId, userId, input.accountId, input.currency);
    this.checkKeys(kv, [input.keyVersion, input.transaction?.keyVersion]);
    const { id, transaction, ...data } = input;
    const row = await this.prisma.$transaction(async (tx) => {
      const created = await tx.fixedTermDeposit.create({ data: { id, householdId, ...data } });
      if (transaction) await this.cash(tx, householdId, userId, input.accountId, 'ADJUSTMENT_OUT', input.startDate, transaction);
      return created;
    });
    return dto(row);
  }

  async update(householdId: string, userId: string, id: string, input: z.infer<typeof updateDeposit>) {
    const kv = await this.validate(householdId, userId, input.accountId, input.currency);
    this.checkKeys(kv, [input.keyVersion]);
    const { expectedRevision, ...data } = input;
    const { count } = await this.prisma.fixedTermDeposit.updateMany({ where: { id, householdId, revision: expectedRevision, deletedAt: null, status: 'ACTIVE' }, data });
    if (count === 0) await this.notFoundOrConflict(householdId, id);
    return dto(await this.prisma.fixedTermDeposit.findUniqueOrThrow({ where: { id } }));
  }

  async collect(householdId: string, userId: string, id: string, input: z.infer<typeof collectDeposit>) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    this.checkKeys(currentKeyVersion, [input.principal.keyVersion, input.interest?.keyVersion]);
    return this.prisma.$transaction(async (tx) => {
      const d = await tx.fixedTermDeposit.findFirst({ where: { id, householdId, deletedAt: null } });
      if (!d) throw new NotFoundException('Plazo fijo no encontrado');
      if (d.revision !== input.expectedRevision || d.status !== 'ACTIVE') throw new ConflictException('El plazo fijo ya se cobró o cambió; recargá');
      const { count } = await tx.fixedTermDeposit.updateMany({ where: { id, revision: input.expectedRevision }, data: { status: 'MATURED' } });
      if (count === 0) throw new ConflictException('El plazo fijo ya se cobró o cambió; recargá');
      await this.cash(tx, householdId, userId, d.accountId, 'ADJUSTMENT_IN', input.date, input.principal);
      if (input.interest) await this.cash(tx, householdId, userId, d.accountId, 'INCOME', input.date, input.interest);
      return dto(await tx.fixedTermDeposit.findUniqueOrThrow({ where: { id } }));
    });
  }

  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint) {
    await this.access.require(householdId, userId, 'write');
    const { count } = await this.prisma.fixedTermDeposit.updateMany({ where: { id, householdId, revision: expectedRevision, deletedAt: null }, data: { deletedAt: new Date() } });
    if (count === 0) await this.notFoundOrConflict(householdId, id);
  }

  private async cash(
    tx: Prisma.TransactionClient,
    householdId: string,
    userId: string,
    accountId: string,
    type: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'INCOME',
    date: Date,
    t: LinkedTransaction,
  ) {
    if (t.categoryId) {
      const kind = type === 'ADJUSTMENT_OUT' ? 'EXPENSE' : 'INCOME';
      const cat = await tx.category.findFirst({ where: { id: t.categoryId, householdId, kind, deletedAt: null } });
      if (!cat) throw new BadRequestException('Categoría inexistente o de otro tipo');
    }
    await tx.transaction.create({
      data: { id: t.id, householdId, accountId, categoryId: t.categoryId, type, status: 'CLEARED', date, createdById: userId, payload: t.payload, keyVersion: t.keyVersion },
    });
  }

  private checkKeys(current: number, versions: (number | undefined)[]) {
    if (versions.some((v) => v !== undefined && v !== current)) throw new ConflictException('La clave del hogar cambió; recargá');
  }

  private async validate(householdId: string, userId: string, accountId: string, currency: string) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    const a = await this.prisma.account.findFirst({ where: { id: accountId, householdId, deletedAt: null } });
    if (!a) throw new BadRequestException('Cuenta inexistente en este hogar');
    if (a.currency !== currency) throw new BadRequestException('La cuenta tiene que estar en la moneda del plazo fijo');
    return currentKeyVersion;
  }

  private async notFoundOrConflict(householdId: string, id: string): Promise<never> {
    const exists = await this.prisma.fixedTermDeposit.findFirst({ where: { id, householdId, deletedAt: null }, select: { id: true } });
    if (!exists) throw new NotFoundException('Plazo fijo no encontrado');
    throw new ConflictException('El plazo fijo cambió; recargá');
  }
}

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/deposits')
export class DepositsController {
  constructor(private readonly deposits: DepositsService) {}

  @Get()
  list(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.deposits.list(hid, uid);
  }

  @Post()
  create(@Param('householdId', uuid) hid: string, @Body({ schema: createDeposit }) body: z.infer<typeof createDeposit>, @CurrentUser('id') uid: string) {
    return this.deposits.create(hid, uid, body);
  }

  @Put(':id')
  update(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Body({ schema: updateDeposit }) body: z.infer<typeof updateDeposit>, @CurrentUser('id') uid: string) {
    return this.deposits.update(hid, uid, id, body);
  }

  @Post(':id/collect')
  @HttpCode(200)
  collect(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Body({ schema: collectDeposit }) body: z.infer<typeof collectDeposit>, @CurrentUser('id') uid: string) {
    return this.deposits.collect(hid, uid, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Query({ schema: deleteQuerySchema }) q: z.infer<typeof deleteQuerySchema>, @CurrentUser('id') uid: string) {
    await this.deposits.remove(hid, uid, id, q.expectedRevision);
  }
}

@Module({ imports: [HouseholdsModule], controllers: [DepositsController], providers: [DepositsService] })
export class DepositsModule {}
