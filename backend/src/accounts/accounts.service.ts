import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Account, CreditCard } from '../generated/prisma/client.js';
import { toBase64 } from '../common/base64.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateAccountInput, UpdateAccountInput } from './accounts.schemas.js';

type AccountRow = Account & { creditCard: CreditCard | null };

/** Lo que ve el cliente: metadatos en claro + payloads cifrados en base64. */
function toDto(a: AccountRow) {
  return {
    id: a.id,
    householdId: a.householdId,
    ownerUserId: a.ownerUserId,
    type: a.type,
    currency: a.currency,
    archivedAt: a.archivedAt,
    payload: toBase64(a.payload),
    keyVersion: a.keyVersion,
    revision: a.revision.toString(),
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    deletedAt: a.deletedAt,
    creditCard:
      a.creditCard && !a.creditCard.deletedAt
        ? {
            closingDay: a.creditCard.closingDay,
            dueDay: a.creditCard.dueDay,
            payload: toBase64(a.creditCard.payload),
            keyVersion: a.creditCard.keyVersion,
          }
        : null,
  };
}
export type AccountDto = ReturnType<typeof toDto>;

@Injectable()
export class AccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  /**
   * Sin `since`: las cuentas vivas. Con `since`: todo lo que cambió después de esa revisión,
   * incluidas las borradas (lápidas), para sincronizar la caché local.
   */
  async list(householdId: string, userId: string, since?: bigint) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.account.findMany({
      where:
        since === undefined
          ? { householdId, deletedAt: null }
          : {
              householdId,
              OR: [{ revision: { gt: since } }, { creditCard: { revision: { gt: since } } }],
            },
      include: { creditCard: true },
      orderBy: { createdAt: 'asc' },
    });
    return { items: rows.map(toDto) };
  }

  async create(householdId: string, userId: string, input: CreateAccountInput): Promise<AccountDto> {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);

    const row = await this.prisma.$transaction(async (tx) => {
      await tx.account.create({
        data: {
          id: input.id,
          householdId,
          ownerUserId: input.ownerUserId,
          type: input.type,
          currency: input.currency,
          payload: input.payload,
          keyVersion: input.keyVersion,
        },
      });
      if (input.creditCard) {
        await tx.creditCard.create({ data: { accountId: input.id, householdId, ...input.creditCard } });
      }
      return tx.account.findUniqueOrThrow({ where: { id: input.id }, include: { creditCard: true } });
    }).catch((error: unknown) => {
      if ((error as { code?: string }).code === 'P2002') throw new ConflictException('Ya existe una cuenta con ese ID');
      throw error;
    });
    return toDto(row);
  }

  async update(householdId: string, userId: string, id: string, input: UpdateAccountInput): Promise<AccountDto> {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    await this.validate(householdId, currentKeyVersion, input);

    const row = await this.prisma.$transaction(async (tx) => {
      // Una sola sentencia condicionada a la revisión: si otro la cambió, no se pisa.
      const { count } = await tx.account.updateMany({
        where: { id, householdId, revision: input.expectedRevision, deletedAt: null },
        data: {
          ownerUserId: input.ownerUserId,
          type: input.type,
          currency: input.currency,
          payload: input.payload,
          keyVersion: input.keyVersion,
          archivedAt: input.archived ? new Date() : null,
        },
      });
      if (count === 0) await this.notFoundOrConflict(id, householdId);

      if (input.creditCard) {
        const data = { ...input.creditCard, deletedAt: null };
        await tx.creditCard.upsert({
          where: { accountId: id },
          create: { accountId: id, householdId, ...data },
          update: data,
        });
      } else {
        await tx.creditCard.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: new Date() } });
      }
      return tx.account.findUniqueOrThrow({ where: { id }, include: { creditCard: true } });
    });
    return toDto(row);
  }

  /** Borrado lógico: queda una lápida para que los demás dispositivos lo sincronicen. */
  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint): Promise<void> {
    await this.access.require(householdId, userId, 'write');
    const inUse = await this.prisma.transaction.count({ where: { accountId: id, householdId, deletedAt: null } });
    if (inUse > 0) throw new ConflictException({ message: 'La cuenta tiene movimientos: archívala', errorCode: 'account_has_transactions' });
    await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const { count } = await tx.account.updateMany({
        where: { id, householdId, revision: expectedRevision, deletedAt: null },
        data: { deletedAt: now },
      });
      if (count === 0) await this.notFoundOrConflict(id, householdId);
      await tx.creditCard.updateMany({ where: { accountId: id, deletedAt: null }, data: { deletedAt: now } });
    });
  }

  private async validate(
    householdId: string,
    currentKeyVersion: number,
    input: Pick<CreateAccountInput, 'currency' | 'keyVersion' | 'ownerUserId' | 'creditCard'>,
  ) {
    if (input.keyVersion !== currentKeyVersion || (input.creditCard && input.creditCard.keyVersion !== currentKeyVersion)) {
      throw new ConflictException('La clave del hogar cambió; recargá');
    }
    const currency = await this.prisma.currency.findUnique({ where: { code: input.currency } });
    if (!currency) throw new BadRequestException('Moneda desconocida');
    if (input.ownerUserId) {
      const owner = await this.prisma.householdMember.findUnique({
        where: { householdId_userId: { householdId, userId: input.ownerUserId } },
      });
      if (!owner) throw new BadRequestException('El titular no es miembro del hogar');
    }
  }

  private async notFoundOrConflict(id: string, householdId: string): Promise<never> {
    const exists = await this.prisma.account.findFirst({ where: { id, householdId, deletedAt: null }, select: { id: true } });
    if (!exists) throw new NotFoundException('Cuenta no encontrada');
    throw new ConflictException('La cuenta cambió mientras la editabas; recargá');
  }
}
