import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, Injectable, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { toBase64 } from '../common/base64.js';
import { encryptedPayload, keyVersion } from '../common/encrypted.js';
import { isoDate, toIsoDate } from '../common/sync.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RatesService } from './rates.service.js';

const uuid = { schema: z.uuid() };
export const USD_RATE_TYPES = ['official', 'mep', 'blue', 'ccl', 'card', 'crypto', 'wholesale'] as const;

/** Cotizaciones públicas (no dependen del usuario). */
@Controller('exchange-rates')
export class PublicRatesController {
  constructor(private readonly rates: RatesService) {}

  @Get('latest')
  latest() {
    return this.rates.latest();
  }
}

/** Cotización cargada por el hogar (cifrada). payload: { rate } */
const createManual = z.object({
  id: z.uuid(),
  base: z.string().trim().toUpperCase().min(3).max(10),
  quote: z.string().trim().toUpperCase().min(3).max(10),
  rateType: z.string().trim().min(1).max(20),
  date: isoDate,
  payload: encryptedPayload,
  keyVersion,
});
const settings = z.object({ usdRateType: z.enum(USD_RATE_TYPES) });

@Injectable()
export class HouseholdRatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.householdExchangeRate.findMany({ where: { householdId, deletedAt: null }, orderBy: { date: 'desc' } });
    return { items: rows.map((r) => ({ id: r.id, base: r.base, quote: r.quote, rateType: r.rateType, date: toIsoDate(r.date), payload: toBase64(r.payload), keyVersion: r.keyVersion })) };
  }

  async create(householdId: string, userId: string, input: z.infer<typeof createManual>) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    if (input.base === input.quote) throw new BadRequestException('Las monedas tienen que ser distintas');
    const known = await this.prisma.currency.count({ where: { code: { in: [input.base, input.quote] } } });
    if (known !== 2) throw new BadRequestException('Moneda desconocida');
    await this.prisma.householdExchangeRate.create({ data: { ...input, householdId } });
    return { id: input.id };
  }

  async remove(householdId: string, userId: string, id: string) {
    await this.access.require(householdId, userId, 'write');
    const { count } = await this.prisma.householdExchangeRate.updateMany({ where: { id, householdId, deletedAt: null }, data: { deletedAt: new Date() } });
    if (count === 0) throw new NotFoundException('Cotización no encontrada');
  }

  async updateSettings(householdId: string, userId: string, input: z.infer<typeof settings>) {
    await this.access.require(householdId, userId, 'write');
    await this.prisma.household.update({ where: { id: householdId }, data: { usdRateType: input.usdRateType } });
    return input;
  }
}

@Controller('households/:householdId')
export class HouseholdRatesController {
  constructor(private readonly rates: HouseholdRatesService) {}

  @Get('exchange-rates')
  list(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.rates.list(hid, uid);
  }

  @Post('exchange-rates')
  create(@Param('householdId', uuid) hid: string, @Body({ schema: createManual }) body: z.infer<typeof createManual>, @CurrentUser('id') uid: string) {
    return this.rates.create(hid, uid, body);
  }

  @Delete('exchange-rates/:id')
  @HttpCode(204)
  async remove(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @CurrentUser('id') uid: string) {
    await this.rates.remove(hid, uid, id);
  }

  @Put('settings')
  settings(@Param('householdId', uuid) hid: string, @Body({ schema: settings }) body: z.infer<typeof settings>, @CurrentUser('id') uid: string) {
    return this.rates.updateSettings(hid, uid, body);
  }
}
