import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { DebtPayment, InstallmentPlan, Transaction } from '../generated/prisma/client.js';
import { toBase64 } from '../common/base64.js';
import { syncPage, toIsoDate, type SyncQuery } from '../common/sync.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTransactionsInput, UpdateTransactionsInput } from './transactions.schemas.js';

type Leg = CreateTransactionsInput['items'][number];

type Linked = Transaction & { installmentPlan?: Pick<InstallmentPlan, 'id' | 'deletedAt'> | null; debtPayment?: Pick<DebtPayment, 'id' | 'debtId' | 'deletedAt'> | null };

function toDto(t: Linked) {
  return {
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
    installmentPlanId: t.installmentPlan && !t.installmentPlan.deletedAt ? t.installmentPlan.id : null,
    debtId: t.debtPayment && !t.debtPayment.deletedAt ? t.debtPayment.debtId : null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    deletedAt: t.deletedAt,
  };
}

const LINKS = {
  installmentPlan: { select: { id: true, deletedAt: true } },
  debtPayment: { select: { id: true, debtId: true, deletedAt: true } },
} as const;

/** Qué tipo de categoría admite cada tipo de movimiento. */
const CATEGORY_KIND: Record<string, 'INCOME' | 'EXPENSE' | null> = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  ADJUSTMENT_IN: 'INCOME',
  ADJUSTMENT_OUT: 'EXPENSE',
  TRANSFER_IN: null,
  TRANSFER_OUT: null,
};

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  /** Página de cambios ordenada por revisión. Con since=0: solo filas vivas (carga inicial). */
  async list(householdId: string, userId: string, { since, limit }: SyncQuery) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.transaction.findMany({
      where: { householdId, revision: { gt: since }, ...(since === 0n ? { deletedAt: null } : {}) },
      orderBy: { revision: 'asc' },
      take: limit + 1,
      include: LINKS,
    });
    const { page, hasMore, nextSince, firstYoungRevision } = syncPage(rows, limit);
    return { items: page.map(toDto), hasMore, nextSince, firstYoungRevision };
  }

  async create(householdId: string, userId: string, input: CreateTransactionsInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input.items);
    try {
      const rows = await this.prisma.$transaction(async (tx) => {
        await tx.transaction.createMany({
          data: input.items.map((t) => ({ ...this.columns(t), id: t.id, householdId, createdById: userId })),
        });
        return tx.transaction.findMany({ where: { id: { in: input.items.map((t) => t.id) } } });
      });
      return { items: rows.map(toDto) };
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Ya existe un movimiento con ese ID');
      throw error;
    }
  }

  async update(householdId: string, userId: string, input: UpdateTransactionsInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    const ids = input.items.map((t) => t.id);
    const existing = await this.prisma.transaction.findMany({ where: { id: { in: ids }, householdId, deletedAt: null }, include: LINKS });
    if (existing.length !== ids.length) throw new NotFoundException('Movimiento no encontrado');
    for (const item of input.items) {
      const current = existing.find((e) => e.id === item.id)!;
      // No se puede convertir un movimiento en transferencia ni separar las patas de una.
      if ((current.installmentPlan && !current.installmentPlan.deletedAt) || (current.debtPayment && !current.debtPayment.deletedAt)) {
        throw new BadRequestException('Las compras en cuotas y los pagos de deudas no se editan: eliminalos y volvé a cargarlos');
      }
      if (current.transferGroupId !== item.transferGroupId) {
        throw new BadRequestException('No se puede cambiar si un movimiento es o no una transferencia');
      }
    }
    await this.validate(householdId, currentKeyVersion, input.items);

    const rows = await this.prisma.$transaction(async (tx) => {
      for (const item of input.items) {
        const { count } = await tx.transaction.updateMany({
          where: { id: item.id, householdId, revision: item.expectedRevision, deletedAt: null },
          data: this.columns(item),
        });
        if (count === 0) throw new ConflictException('El movimiento cambió mientras lo editabas; recargá');
      }
      return tx.transaction.findMany({ where: { id: { in: ids } } });
    });
    return { items: rows.map(toDto) };
  }

  /** Borrado lógico. Si es una transferencia, se borran las dos patas. */
  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint) {
    await this.access.require(householdId, userId, 'write');
    await this.prisma.$transaction(async (tx) => {
      const row = await tx.transaction.findFirst({ where: { id, householdId, deletedAt: null } });
      if (!row) throw new NotFoundException('Movimiento no encontrado');
      if (row.revision !== expectedRevision) throw new ConflictException('El movimiento cambió; recargá');
      const now = new Date();
      // Lo que cuelga de este movimiento se va con él: plan de cuotas o pago de deuda.
      const plan = await tx.installmentPlan.findFirst({ where: { transactionId: id, deletedAt: null } });
      if (plan) {
        await tx.installmentPlan.update({ where: { id: plan.id }, data: { deletedAt: now } });
        await tx.cardInstallment.updateMany({ where: { planId: plan.id, deletedAt: null }, data: { deletedAt: now } });
      }
      await tx.debtPayment.updateMany({ where: { transactionId: id, deletedAt: null }, data: { deletedAt: now } });
      await tx.investmentTransaction.updateMany({ where: { cashTransactionId: id, deletedAt: null }, data: { deletedAt: now } });
      await tx.transaction.updateMany({
        where: row.transferGroupId
          ? { householdId, transferGroupId: row.transferGroupId, deletedAt: null }
          : { id, householdId, revision: expectedRevision },
        data: { deletedAt: now },
      });
    });
  }

  private columns(t: Leg) {
    return {
      accountId: t.accountId,
      categoryId: t.categoryId,
      type: t.type,
      status: t.status,
      date: t.date,
      transferGroupId: t.transferGroupId,
      payload: t.payload,
      keyVersion: t.keyVersion,
    };
  }

  private async validate(householdId: string, currentKeyVersion: number, items: Leg[]) {
    if (items.some((t) => t.keyVersion !== currentKeyVersion)) {
      throw new ConflictException('La clave del hogar cambió; recargá');
    }
    const accountIds = [...new Set(items.map((t) => t.accountId))];
    const accounts = await this.prisma.account.count({ where: { id: { in: accountIds }, householdId, deletedAt: null } });
    if (accounts !== accountIds.length) throw new BadRequestException('Cuenta inexistente en este hogar');

    const categoryIds = [...new Set(items.flatMap((t) => (t.categoryId ? [t.categoryId] : [])))];
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds }, householdId, deletedAt: null },
      select: { id: true, kind: true },
    });
    for (const t of items) {
      if (!t.categoryId) continue;
      const category = categories.find((c) => c.id === t.categoryId);
      if (!category) throw new BadRequestException('Categoría inexistente en este hogar');
      if (CATEGORY_KIND[t.type] !== category.kind) {
        throw new BadRequestException('La categoría no corresponde al tipo de movimiento');
      }
    }
  }
}
