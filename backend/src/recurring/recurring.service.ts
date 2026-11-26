import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { RecurringRule } from '../generated/prisma/client.js';
import { toBase64 } from '../common/base64.js';
import { toIsoDate } from '../common/sync.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateRuleInput, PostOccurrencesInput, UpdateRuleInput } from './recurring.schemas.js';

function toDto(r: RecurringRule) {
  return {
    id: r.id,
    householdId: r.householdId,
    accountId: r.accountId,
    categoryId: r.categoryId,
    type: r.type,
    frequency: r.frequency,
    interval: r.interval,
    dayOfMonth: r.dayOfMonth,
    startDate: toIsoDate(r.startDate),
    endDate: r.endDate ? toIsoDate(r.endDate) : null,
    nextRunOn: toIsoDate(r.nextRunOn),
    autoPost: r.autoPost,
    isSalary: r.isSalary,
    active: r.active,
    payload: toBase64(r.payload),
    keyVersion: r.keyVersion,
    revision: r.revision.toString(),
    deletedAt: r.deletedAt,
  };
}

@Injectable()
export class RecurringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.recurringRule.findMany({
      where: { householdId, deletedAt: null },
      orderBy: { nextRunOn: 'asc' },
    });
    return { items: rows.map(toDto) };
  }

  async create(householdId: string, userId: string, input: CreateRuleInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);
    const { id, ...data } = input;
    const row = await this.prisma.recurringRule
      .create({ data: { id, householdId, ...data } })
      .catch((error: unknown) => {
        if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Ya existe una regla con ese ID');
        throw error;
      });
    return toDto(row);
  }

  async update(householdId: string, userId: string, id: string, input: UpdateRuleInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);
    const { expectedRevision, ...data } = input;
    const { count } = await this.prisma.recurringRule.updateMany({
      where: { id, householdId, revision: expectedRevision, deletedAt: null },
      data,
    });
    if (count === 0) await this.notFoundOrConflict(id, householdId);
    return toDto(await this.prisma.recurringRule.findUniqueOrThrow({ where: { id } }));
  }

  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint) {
    await this.access.require(householdId, userId, 'write');
    const { count } = await this.prisma.recurringRule.updateMany({
      where: { id, householdId, revision: expectedRevision, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (count === 0) await this.notFoundOrConflict(id, householdId);
  }

  /** Ver postOccurrencesSchema: movimientos + avance de la regla, todo o nada. */
  async postOccurrences(householdId: string, userId: string, id: string, input: PostOccurrencesInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.transactions.some((t) => t.keyVersion !== currentKeyVersion)) {
      throw new ConflictException('La clave del hogar cambió; recargá');
    }
    return this.prisma.$transaction(async (tx) => {
      const rule = await tx.recurringRule.findFirst({ where: { id, householdId, deletedAt: null } });
      if (!rule) throw new NotFoundException('Regla no encontrada');
      // Primero la revisión: si otro dispositivo ya avanzó la regla, es un 409 (recargar), no un error de datos.
      if (rule.revision !== input.expectedRevision) {
        throw new ConflictException('Otro dispositivo ya registró estas ocurrencias; recargá');
      }
      if (input.nextRunOn <= rule.nextRunOn) throw new BadRequestException('La próxima fecha tiene que avanzar');
      if (input.transactions.length > 0) {
        if (!rule.active) throw new BadRequestException('La regla está pausada');
        const account = await tx.account.findFirst({ where: { id: rule.accountId, deletedAt: null }, select: { id: true } });
        if (!account) throw new BadRequestException('La cuenta de la regla ya no existe');
      }
      if (input.transactions.some((t) => t.date < rule.nextRunOn || t.date >= input.nextRunOn)) {
        throw new BadRequestException('Las ocurrencias deben caer entre la fecha pendiente y la próxima');
      }
      const { count } = await tx.recurringRule.updateMany({
        where: { id, revision: input.expectedRevision, deletedAt: null },
        data: { nextRunOn: input.nextRunOn, active: input.active },
      });
      if (count === 0) throw new ConflictException('Otro dispositivo ya registró estas ocurrencias; recargá');

      if (input.transactions.length > 0) {
        await tx.transaction.createMany({
          data: input.transactions.map((t) => ({
            id: t.id,
            householdId,
            accountId: rule.accountId,
            categoryId: rule.categoryId,
            type: rule.type,
            status: 'CLEARED' as const,
            date: t.date,
            recurringRuleId: rule.id,
            createdById: userId,
            payload: t.payload,
            keyVersion: t.keyVersion,
          })),
        });
      }
      const updated = await tx.recurringRule.findUniqueOrThrow({ where: { id } });
      const transactions = await tx.transaction.findMany({ where: { id: { in: input.transactions.map((t) => t.id) } } });
      return {
        rule: toDto(updated),
        transactions: transactions.map((t) => ({
          id: t.id,
          householdId: t.householdId,
          accountId: t.accountId,
          categoryId: t.categoryId,
          type: t.type,
          status: t.status,
          date: toIsoDate(t.date),
          transferGroupId: t.transferGroupId,
          recurringRuleId: t.recurringRuleId,
          createdById: t.createdById,
          payload: toBase64(t.payload),
          keyVersion: t.keyVersion,
          revision: t.revision.toString(),
          deletedAt: t.deletedAt,
        })),
      };
    });
  }

  private async validate(
    householdId: string,
    currentKeyVersion: number,
    input: Pick<CreateRuleInput, 'accountId' | 'categoryId' | 'type' | 'keyVersion'>,
  ) {
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    const account = await this.prisma.account.findFirst({ where: { id: input.accountId, householdId, deletedAt: null } });
    if (!account) throw new BadRequestException('Cuenta inexistente en este hogar');
    if (input.categoryId) {
      const category = await this.prisma.category.findFirst({ where: { id: input.categoryId, householdId, deletedAt: null } });
      if (!category) throw new BadRequestException('Categoría inexistente en este hogar');
      if (category.kind !== input.type) throw new BadRequestException('La categoría no corresponde al tipo');
    }
  }

  private async notFoundOrConflict(id: string, householdId: string): Promise<never> {
    const exists = await this.prisma.recurringRule.findFirst({ where: { id, householdId, deletedAt: null }, select: { id: true } });
    if (!exists) throw new NotFoundException('Regla no encontrada');
    throw new ConflictException('La regla cambió mientras la editabas; recargá');
  }
}
