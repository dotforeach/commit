import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Budget, BudgetItem } from '../generated/prisma/client.js';
import { toBase64 } from '../common/base64.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateBudgetInput, UpdateBudgetInput } from './budgets.schemas.js';

function toDto(b: Budget & { items: BudgetItem[] }) {
  return {
    id: b.id,
    householdId: b.householdId,
    year: b.year,
    month: b.month,
    method: b.method,
    currency: b.currency,
    payload: toBase64(b.payload),
    keyVersion: b.keyVersion,
    revision: b.revision.toString(),
    items: b.items
      .filter((i) => !i.deletedAt)
      .map((i) => ({
        id: i.id,
        categoryId: i.categoryId,
        rollover: i.rollover,
        alertThreshold: i.alertThreshold,
        payload: toBase64(i.payload),
        keyVersion: i.keyVersion,
        revision: i.revision.toString(),
      })),
  };
}

type Item = CreateBudgetInput['items'][number];

@Injectable()
export class BudgetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  /** Todos los presupuestos del hogar (son pocos: uno por mes). */
  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.budget.findMany({
      where: { householdId, deletedAt: null },
      include: { items: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    return { items: rows.map(toDto) };
  }

  async create(householdId: string, userId: string, input: CreateBudgetInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        // Un presupuesto borrado libera su mes.
        await tx.budget.deleteMany({ where: { householdId, year: input.year, month: input.month, deletedAt: { not: null } } });
        await tx.budget.create({
          data: {
            id: input.id,
            householdId,
            year: input.year,
            month: input.month,
            method: input.method,
            currency: input.currency,
            payload: input.payload,
            keyVersion: input.keyVersion,
          },
        });
        if (input.items.length > 0) {
          await tx.budgetItem.createMany({ data: input.items.map((i) => ({ ...this.itemColumns(i), id: i.id, householdId, budgetId: input.id })) });
        }
        return tx.budget.findUniqueOrThrow({ where: { id: input.id }, include: { items: true } });
      });
      return toDto(row);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Ya existe un presupuesto para ese mes');
      throw error;
    }
  }

  /**
   * Reemplaza el presupuesto y su lista de ítems de forma atómica. Un ítem existente se
   * identifica por categoría y debe venir con su mismo ID (su payload está atado a ese ID).
   */
  async update(householdId: string, userId: string, id: string, input: UpdateBudgetInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);
    const row = await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.budget.updateMany({
        where: { id, householdId, revision: input.expectedRevision, deletedAt: null },
        data: { method: input.method, currency: input.currency, payload: input.payload, keyVersion: input.keyVersion },
      });
      if (count === 0) await this.notFoundOrConflict(id, householdId);

      const existing = await tx.budgetItem.findMany({ where: { budgetId: id } });
      const byCategory = new Map(existing.map((e) => [e.categoryId, e]));
      for (const item of input.items) {
        const current = byCategory.get(item.categoryId);
        if (current && current.id !== item.id) throw new ConflictException('El presupuesto cambió mientras lo editabas; recargá');
        if (current) await tx.budgetItem.update({ where: { id: item.id }, data: { ...this.itemColumns(item), deletedAt: null } });
        else await tx.budgetItem.create({ data: { ...this.itemColumns(item), id: item.id, householdId, budgetId: id } });
      }
      const keep = new Set(input.items.map((i) => i.categoryId));
      await tx.budgetItem.deleteMany({ where: { budgetId: id, categoryId: { notIn: [...keep] } } });
      return tx.budget.findUniqueOrThrow({ where: { id }, include: { items: true } });
    });
    return toDto(row);
  }

  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint) {
    await this.access.require(householdId, userId, 'write');
    const { count } = await this.prisma.budget.updateMany({
      where: { id, householdId, revision: expectedRevision, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (count === 0) await this.notFoundOrConflict(id, householdId);
  }

  private itemColumns(i: Item) {
    return { categoryId: i.categoryId, rollover: i.rollover, alertThreshold: i.alertThreshold, payload: i.payload, keyVersion: i.keyVersion };
  }

  private async validate(householdId: string, currentKeyVersion: number, input: Pick<CreateBudgetInput, 'currency' | 'keyVersion' | 'items'>) {
    if (input.keyVersion !== currentKeyVersion || input.items.some((i) => i.keyVersion !== currentKeyVersion)) {
      throw new ConflictException('La clave del hogar cambió; recargá');
    }
    if (!(await this.prisma.currency.findUnique({ where: { code: input.currency } }))) throw new BadRequestException('Moneda desconocida');
    const ids = input.items.map((i) => i.categoryId);
    const found = await this.prisma.category.count({ where: { id: { in: ids }, householdId, kind: 'EXPENSE', deletedAt: null } });
    if (found !== ids.length) throw new BadRequestException('Solo se presupuestan categorías de gasto del hogar');
  }

  private async notFoundOrConflict(id: string, householdId: string): Promise<never> {
    const exists = await this.prisma.budget.findFirst({ where: { id, householdId, deletedAt: null }, select: { id: true } });
    if (!exists) throw new NotFoundException('Presupuesto no encontrado');
    throw new ConflictException('El presupuesto cambió mientras lo editabas; recargá');
  }
}
