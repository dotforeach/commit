import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersRepository } from '../users/users.repository.js';
import type { AuthUser } from '../users/user.types.js';
import type { RegisterInput } from './auth.schemas.js';
import { memberKeySignedMessage, verifyEd25519 } from './member-key-signature.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /**
   * Crea el usuario, sus claves (cifradas en el navegador), su hogar personal con la clave
   * del hogar envuelta para él, y las categorías por defecto (cifradas). Todo o nada.
   */
  async register(input: RegisterInput): Promise<AuthUser> {
    const { household, keys, categories } = input;

    const message = memberKeySignedMessage(household.id, 1, input.userId, household.memberKey.wrappedKey);
    if (!verifyEd25519(keys.signingPublicKey, message, household.memberKey.signature)) {
      throw new BadRequestException('La firma de la clave del hogar no es válida');
    }

    const ids = new Set(categories.map((c) => c.id));
    if (ids.size !== categories.length) throw new BadRequestException('Categorías con ID repetido');
    if (categories.some((c) => c.parentId !== null && !ids.has(c.parentId))) {
      throw new BadRequestException('Una categoría referencia a un padre inexistente');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const toRow = (c: (typeof categories)[number]) => ({
      id: c.id,
      householdId: household.id,
      parentId: c.parentId,
      kind: c.kind,
      budgetGroup: c.budgetGroup,
      systemKey: c.systemKey,
      payload: c.payload,
      keyVersion: 1,
    });

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id: input.userId,
            email: input.email,
            passwordHash,
            displayName: input.displayName,
            locale: input.locale,
            timezone: input.timezone,
          },
        });
        await tx.userKeys.create({
          data: {
            userId: input.userId,
            publicKey: keys.publicKey,
            signingPublicKey: keys.signingPublicKey,
            encryptedPrivateKeys: keys.encryptedPrivateKeys,
            kdfSalt: keys.kdfSalt,
            kdfParams: keys.kdfParams,
            recoveryEncryptedKeys: keys.recoveryEncryptedKeys,
            recoveryKdfSalt: keys.recoveryKdfSalt,
          },
        });
        await tx.household.create({
          data: {
            id: household.id,
            baseCurrency: household.baseCurrency,
            isPersonal: true,
            currentKeyVersion: 1,
            payload: household.payload,
            keyVersion: 1,
          },
        });
        await tx.householdKey.create({ data: { householdId: household.id, version: 1 } });
        await tx.householdMember.create({
          data: { householdId: household.id, userId: input.userId, role: 'OWNER', status: 'ACTIVE' },
        });
        await tx.householdMemberKey.create({
          data: {
            householdId: household.id,
            version: 1,
            userId: input.userId,
            userKeyVersion: 1,
            wrappedKey: household.memberKey.wrappedKey,
            signature: household.memberKey.signature,
            wrappedById: input.userId,
          },
        });
        await tx.user.update({ where: { id: input.userId }, data: { defaultHouseholdId: household.id } });
        // Padres primero: la FK de parentId se valida fila por fila.
        await tx.category.createMany({ data: categories.filter((c) => c.parentId === null).map(toRow) });
        await tx.category.createMany({ data: categories.filter((c) => c.parentId !== null).map(toRow) });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('Ya existe una cuenta con ese email');
        if (error.code === 'P2003') throw new BadRequestException('Moneda base desconocida');
      }
      throw error;
    }

    return { id: input.userId, email: input.email, displayName: input.displayName };
  }

  /** El usuario, o null si el email o la contraseña no coinciden (mismo tiempo en ambos casos). */
  async verifyCredentials(email: string, password: string): Promise<AuthUser | null> {
    const found = await this.users.findCredentials(email);
    const valid = await this.passwordHasher.verify(password, found?.passwordHash);
    if (!valid || !found) return null;
    if (this.passwordHasher.needsRehash(found.passwordHash)) {
      await this.users.updatePasswordHash(found.user.id, await this.passwordHasher.hash(password));
    }
    return found.user;
  }
}
