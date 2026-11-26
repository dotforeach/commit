import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Debt, DebtPayment } from '../generated/prisma/client.js';
import { toBase64 } from '../common/base64.js';
import { toIsoDate } from '../common/sync.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateDebtInput, CreatePaymentInput, UpdateDebtInput } from './debts.schemas.js';

const paymentDto = (p: DebtPayment) => ({
  id: p.id,
  debtId: p.debtId,
  transactionId: p.transactionId,
  date: toIsoDate(p.date),
  payload: toBase64(p.payload),
  keyVersion: p.keyVersion,
  revision: p.revision.toString(),
});

function toDto(d: Debt & { payments: DebtPayment[] }) {
  return {
    id: d.id,
    accountId: d.accountId,
    kind: d.kind,
    currency: d.currency,
    rateType: d.rateType,
    amortization: d.amortization,
    termMonths: d.termMonths,
    startDate: toIsoDate(d.startDate),
    paymentDay: d.paymentDay,
    status: d.status,
    payload: toBase64(d.payload),
    keyVersion: d.keyVersion,
    revision: d.revision.toString(),
    payments: d.payments.filter((p) => !p.deletedAt).map(paymentDto),
  };
}

@Injectable()
export class DebtsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.debt.findMany({
      where: { householdId, deletedAt: null },
      include: { payments: { orderBy: { date: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
    return { items: rows.map(toDto) };
  }

  async create(householdId: string, userId: string, input: CreateDebtInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);
    const { id, ...data } = input;
    try {
      await this.prisma.debt.create({ data: { id, householdId, ...data } });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Ya existe una deuda con ese ID');
      throw error;
    }
    return this.get(householdId, id);
  }

  async update(householdId: string, userId: string, id: string, input: UpdateDebtInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);
    const { expectedRevision, ...data } = input;
    const { count } = await this.prisma.debt.updateMany({ where: { id, householdId, revision: expectedRevision, deletedAt: null }, data });
    if (count === 0) await this.notFoundOrConflict(id, householdId);
    return this.get(householdId, id);
  }

  /** Borrar una deuda borra sus pagos, pero no los movimientos (la plata sí salió de la cuenta). */
  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint) {
    await this.access.require(householdId, userId, 'write');
    await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const { count } = await tx.debt.updateMany({ where: { id, householdId, revision: expectedRevision, deletedAt: null }, data: { deletedAt: now } });
      if (count === 0) await this.notFoundOrConflict(id, householdId);
      await tx.debtPayment.updateMany({ where: { debtId: id, deletedAt: null }, data: { deletedAt: now, transactionId: null } });
    });
  }

  /** Registra el pago: gasto en la cuenta + pago de la deuda, atómico. */
  async addPayment(householdId: string, userId: string, debtId: string, input: CreatePaymentInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.keyVersion !== currentKeyVersion || input.transaction.keyVersion !== currentKeyVersion) {
      throw new ConflictException('La clave del hogar cambió; recargá');
    }
    const debt = await this.prisma.debt.findFirst({ where: { id: debtId, householdId, deletedAt: null } });
    if (!debt) throw new NotFoundException('Deuda no encontrada');
    const account = await this.prisma.account.findFirst({ where: { id: input.transaction.accountId, householdId, deletedAt: null } });
    if (!account) throw new BadRequestException('Cuenta inexistente en este hogar');
    if (account.currency !== debt.currency) throw new BadRequestException('La cuenta de pago tiene que estar en la moneda de la deuda');
    if (input.transaction.categoryId) {
      const cat = await this.prisma.category.findFirst({ where: { id: input.transaction.categoryId, householdId, kind: 'EXPENSE', deletedAt: null } });
      if (!cat) throw new BadRequestException('Categoría de gasto inexistente en este hogar');
    }
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            id: input.transaction.id,
            householdId,
            accountId: input.transaction.accountId,
            categoryId: input.transaction.categoryId,
            type: 'EXPENSE',
            status: 'CLEARED',
            date: input.date,
            createdById: userId,
            payload: input.transaction.payload,
            keyVersion: input.transaction.keyVersion,
          },
        });
        await tx.debtPayment.create({
          data: {
            id: input.id,
            householdId,
            debtId,
            transactionId: input.transaction.id,
            date: input.date,
            payload: input.payload,
            keyVersion: input.keyVersion,
          },
        });
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Ese pago ya existe');
      throw error;
    }
    return this.get(householdId, debtId);
  }

  /** Borrar un pago borra también su movimiento. */
  async removePayment(householdId: string, userId: string, debtId: string, paymentId: string) {
    await this.access.require(householdId, userId, 'write');
    await this.prisma.$transaction(async (tx) => {
      const p = await tx.debtPayment.findFirst({ where: { id: paymentId, debtId, householdId, deletedAt: null } });
      if (!p) throw new NotFoundException('Pago no encontrado');
      const now = new Date();
      await tx.debtPayment.update({ where: { id: paymentId }, data: { deletedAt: now } });
      if (p.transactionId) await tx.transaction.updateMany({ where: { id: p.transactionId, deletedAt: null }, data: { deletedAt: now } });
    });
    return this.get(householdId, debtId);
  }

  private async get(householdId: string, id: string) {
    const d = await this.prisma.debt.findFirstOrThrow({ where: { id, householdId }, include: { payments: { orderBy: { date: 'asc' } } } });
    return toDto(d);
  }

  private async validate(householdId: string, currentKeyVersion: number, input: Pick<CreateDebtInput, 'currency' | 'keyVersion' | 'accountId'>) {
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    if (!(await this.prisma.currency.findUnique({ where: { code: input.currency } }))) throw new BadRequestException('Moneda desconocida');
    if (input.accountId) {
      const a = await this.prisma.account.findFirst({ where: { id: input.accountId, householdId, deletedAt: null } });
      if (!a) throw new BadRequestException('Cuenta inexistente en este hogar');
    }
  }

  private async notFoundOrConflict(id: string, householdId: string): Promise<never> {
    const exists = await this.prisma.debt.findFirst({ where: { id, householdId, deletedAt: null }, select: { id: true } });
    if (!exists) throw new NotFoundException('Deuda no encontrada');
    throw new ConflictException('La deuda cambió mientras la editabas; recargá');
  }
}
