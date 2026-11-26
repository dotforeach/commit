import { Body, Controller, Get, HttpCode, NotFoundException, Put } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '@nestjs/authentication';
import { toBase64 } from '../common/base64.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { KeysService } from './keys.service.js';
import { updateKeysSchema, type UpdateKeysInput } from './keys.schemas.js';
import type { AuthUser } from './user.types.js';

/**
 * Todo lo que el navegador necesita para desbloquear: perfil, claves privadas CIFRADAS
 * y las claves de cada hogar envueltas para este usuario. El servidor no puede abrir nada de esto.
 */
@Controller('me')
export class MeController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly keysService: KeysService,
  ) {}

  /** Cambio de clave de descifrado o recuperación con la frase (ver KeysService). */
  @Put('keys')
  @HttpCode(204)
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  async updateKeys(@CurrentUser('id') userId: string, @Body({ schema: updateKeysSchema }) body: UpdateKeysInput) {
    await this.keysService.update(userId, body);
  }

  @Get()
  async me(@CurrentUser() current: AuthUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: current.id },
      include: {
        keys: true,
        memberships: {
          include: {
            household: {
              include: {
                keys: {
                  include: {
                    memberKeys: {
                      where: { userId: current.id },
                      include: { wrappedBy: { select: { keys: { select: { signingPublicKey: true } } } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!user?.keys) throw new NotFoundException();
    const { keys } = user;

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        locale: user.locale,
        timezone: user.timezone,
        defaultHouseholdId: user.defaultHouseholdId,
        onboardingStep: user.onboardingStep,
        onboardingCompletedAt: user.onboardingCompletedAt,
      },
      keys: {
        keyVersion: keys.keyVersion,
        publicKey: toBase64(keys.publicKey),
        signingPublicKey: toBase64(keys.signingPublicKey),
        encryptedPrivateKeys: toBase64(keys.encryptedPrivateKeys),
        kdfSalt: toBase64(keys.kdfSalt),
        kdfParams: keys.kdfParams,
        recoveryEncryptedKeys: toBase64(keys.recoveryEncryptedKeys),
        recoveryKdfSalt: toBase64(keys.recoveryKdfSalt),
      },
      households: user.memberships.map(({ household, role, status }) => ({
        id: household.id,
        baseCurrency: household.baseCurrency,
        isPersonal: household.isPersonal,
        currentKeyVersion: household.currentKeyVersion,
        usdRateType: household.usdRateType,
        payload: toBase64(household.payload),
        keyVersion: household.keyVersion,
        role,
        status,
        memberKeys: household.keys.flatMap((hk) =>
          hk.memberKeys.map((mk) => ({
            version: mk.version,
            userKeyVersion: mk.userKeyVersion,
            wrappedKey: toBase64(mk.wrappedKey),
            signature: toBase64(mk.signature),
            wrappedById: mk.wrappedById,
            wrappedBySigningPublicKey: mk.wrappedBy.keys ? toBase64(mk.wrappedBy.keys.signingPublicKey) : null,
          })),
        ),
      })),
    };
  }
}
