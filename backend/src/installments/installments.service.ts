import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import type { CardInstallment, InstallmentPlan } from '../generated/prisma/client.js';
import { toBase64 } from '../common/base64.js';
import { toIsoDate } from '../common/sync.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePlanInput } from './installments.schemas.js';

function toDto(p: InstallmentPlan & { installments: CardInstallment[] }) {
  return {
    id: p.id,
    creditCardId: p.creditCardId,
    transactionId: p.transactionId,
    installmentsCount: p.installmentsCount,
    interestFree: p.interestFree,
    firstStatementOn: toIsoDate(p.firstStatementOn),
    payload: toBase64(p.payload),
    keyVersion: p.keyVersion,
    revision: p.revision.toString(),
    installments: p.installments
      .filter((i) => !i.deletedAt)
      .sort((a, b) => a.number - b.number)
      .map((i) => ({ id: i.id, number: i.number, dueMonth: toIsoDate(i.dueMonth), payload: toBase64(i.payload), keyVersion: i.keyVersion })),
  };
}

@Injectable()
export class InstallmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.installmentPlan.findMany({
      where: { householdId, deletedAt: null },
      include: { installments: true },
    });
    return { items: rows.map(toDto) };
  }

  async create(householdId: string, userId: string, input: CreatePlanInput) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    const versions = [input.keyVersion, input.transaction.keyVersion, ...input.installments.map((i) => i.keyVersion)];
    if (versions.some((v) => v !== currentKeyVersion)) throw new ConflictException('La clave del hogar cambió; recargá');
    const card = await this.prisma.creditCard.findFirst({
      where: { accountId: input.creditCardId, householdId, deletedAt: null, account: { deletedAt: null } },
    });
    if (!card) throw new BadRequestException('Tarjeta de crédito inexistente en este hogar');
    if (input.transaction.categoryId) {
      const cat = await this.prisma.category.findFirst({ where: { id: input.transaction.categoryId, householdId, kind: 'EXPENSE', deletedAt: null } });
      if (!cat) throw new BadRequestException('Categoría de gasto inexistente en este hogar');
    }
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            id: input.transaction.id,
            householdId,
            accountId: input.creditCardId,
            categoryId: input.transaction.categoryId,
            type: 'EXPENSE',
            status: 'CLEARED',
            date: input.transaction.date,
            createdById: userId,
            payload: input.transaction.payload,
            keyVersion: input.transaction.keyVersion,
          },
        });
        await tx.installmentPlan.create({
          data: {
            id: input.id,
            householdId,
            creditCardId: input.creditCardId,
            transactionId: input.transaction.id,
            installmentsCount: input.installmentsCount,
            interestFree: input.interestFree,
            firstStatementOn: input.firstStatementOn,
            payload: input.payload,
            keyVersion: input.keyVersion,
          },
        });
        await tx.cardInstallment.createMany({
          data: input.installments.map((i) => ({
            id: i.id,
            householdId,
            planId: input.id,
            number: i.number,
            dueMonth: i.dueMonth,
            payload: i.payload,
            keyVersion: i.keyVersion,
          })),
        });
        return tx.installmentPlan.findUniqueOrThrow({ where: { id: input.id }, include: { installments: true } });
      });
      return toDto(row);
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Esa compra en cuotas ya existe');
      throw error;
    }
  }
}
