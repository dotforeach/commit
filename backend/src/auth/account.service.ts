import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import type { AccountTokenType } from '../generated/prisma/client.js';
import { AppMailer, type Recipient } from '../mail/app-mailer.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

const TTL: Record<AccountTokenType, number> = {
  VERIFY_EMAIL: 24 * 3600_000,
  RESET_PASSWORD: 3600_000,
  CHANGE_EMAIL: 24 * 3600_000,
};
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

/** "Chrome en macOS" a partir del user-agent (sin IP ni ubicación). */
export function deviceLabel(userAgent: string | undefined): string {
  const ua = userAgent ?? '';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Navegador';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'macOS' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'otro sistema';
  return `${browser} en ${os}`;
}

/**
 * Ciclo de la cuenta: verificación de correo, contraseña olvidada y cambios, cambio de correo,
 * cierre de sesiones, eliminación y avisos. Los tokens viajan por correo; se guarda solo su hash.
 */
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: AppMailer,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
    private readonly auth: AuthService,
  ) {}

  // ── Tokens de un solo uso ─────────────────────────────────────────────────────
  private async createToken(userId: string, type: AccountTokenType, newEmail?: string) {
    const token = randomBytes(32).toString('base64url');
    await this.prisma.$transaction([
      // Un enlace nuevo invalida los anteriores del mismo tipo
      this.prisma.accountToken.updateMany({ where: { userId, type, usedAt: null }, data: { usedAt: new Date() } }),
      this.prisma.accountToken.create({ data: { userId, type, tokenHash: sha256(token), newEmail, expiresAt: new Date(Date.now() + TTL[type]) } }),
    ]);
    return token;
  }

  /** Marca el token como usado de forma atómica (no se puede usar dos veces en paralelo). */
  private async consumeToken(token: string, type: AccountTokenType) {
    const row = await this.prisma.accountToken.findUnique({ where: { tokenHash: sha256(token) } });
    if (!row || row.type !== type || row.usedAt || row.expiresAt < new Date()) throw new BadRequestException('El enlace no es válido o ya venció');
    const { count } = await this.prisma.accountToken.updateMany({ where: { id: row.id, usedAt: null }, data: { usedAt: new Date() } });
    if (count === 0) throw new BadRequestException('El enlace no es válido o ya venció');
    return row;
  }

  private async recipient(userId: string): Promise<Recipient & { emailVerifiedAt: Date | null }> {
    const u = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, displayName: true, emailVerifiedAt: true } });
    return u;
  }

  // ── Verificación y bienvenida ─────────────────────────────────────────────────
  async sendVerification(userId: string) {
    const r = await this.recipient(userId);
    if (r.emailVerifiedAt) return { alreadyVerified: true };
    await this.mailer.verifyEmail(r, await this.createToken(userId, 'VERIFY_EMAIL'));
    return { alreadyVerified: false };
  }

  async verifyEmail(token: string) {
    const row = await this.consumeToken(token, 'VERIFY_EMAIL');
    const { count } = await this.prisma.user.updateMany({ where: { id: row.userId, emailVerifiedAt: null }, data: { emailVerifiedAt: new Date() } });
    if (count > 0) await this.mailer.welcome(await this.recipient(row.userId));
  }

  async assertVerified(userId: string) {
    const { emailVerifiedAt } = await this.recipient(userId);
    if (!emailVerifiedAt) throw new ForbiddenException({ message: 'Verifica tu correo para usar esta función', errorCode: 'email_not_verified' });
  }

  // ── Contraseña ────────────────────────────────────────────────────────────────
  /** Siempre responde igual, exista o no la cuenta (no revela qué correos están registrados). */
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true, email: true, displayName: true, deletedAt: true } });
    if (!user || user.deletedAt) return;
    await this.mailer.resetPassword(user, await this.createToken(user.id, 'RESET_PASSWORD'));
  }

  async resetPassword(token: string, password: string) {
    const row = await this.consumeToken(token, 'RESET_PASSWORD');
    await this.prisma.user.update({ where: { id: row.userId }, data: { passwordHash: await this.hasher.hash(password) } });
    await this.tokens.revokeAll(row.userId);
    await this.mailer.passwordChanged(await this.recipient(row.userId));
  }

  async changePassword(userId: string, current: string, next: string) {
    await this.checkPassword(userId, current);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: await this.hasher.hash(next) } });
    await this.tokens.revokeAll(userId); // el controlador abre una sesión nueva para este dispositivo
    await this.mailer.passwordChanged(await this.recipient(userId));
  }

  private async checkPassword(userId: string, password: string) {
    const { email } = await this.recipient(userId);
    if (!(await this.auth.verifyCredentials(email, password))) throw new UnauthorizedException('La contraseña no es correcta');
  }

  // ── Correo ────────────────────────────────────────────────────────────────────
  async requestEmailChange(userId: string, password: string, newEmail: string) {
    await this.checkPassword(userId, password);
    const r = await this.recipient(userId);
    if (r.email.toLowerCase() === newEmail.toLowerCase()) throw new BadRequestException('Ese ya es tu correo');
    if (await this.prisma.user.findUnique({ where: { email: newEmail }, select: { id: true } })) throw new ConflictException('Ese correo ya está en uso');
    await this.mailer.confirmEmailChange(r, newEmail, await this.createToken(userId, 'CHANGE_EMAIL', newEmail));
    await this.mailer.emailChangeRequested(r, newEmail);
  }

  async confirmEmailChange(token: string) {
    const row = await this.consumeToken(token, 'CHANGE_EMAIL');
    if (!row.newEmail) throw new BadRequestException('El enlace no es válido o ya venció');
    try {
      await this.prisma.user.update({ where: { id: row.userId }, data: { email: row.newEmail, emailVerifiedAt: new Date() } });
    } catch {
      throw new ConflictException('Ese correo ya está en uso');
    }
  }

  // ── Sesiones y dispositivos ───────────────────────────────────────────────────
  revokeAll(userId: string) {
    return this.tokens.revokeAll(userId);
  }

  /**
   * Registra el dispositivo (cookie aleatoria; se guarda su hash). Si es nuevo y la cuenta ya tenía
   * dispositivos, avisa por correo. Devuelve el id de dispositivo a guardar en la cookie.
   */
  async rememberDevice(userId: string, deviceId: string | undefined, userAgent: string | undefined, notify: boolean): Promise<string> {
    const id = deviceId && /^[A-Za-z0-9_-]{20,64}$/.test(deviceId) ? deviceId : randomBytes(24).toString('base64url');
    const hash = sha256(`${userId}:${id}`);
    const known = await this.prisma.knownDevice.findUnique({ where: { userId_deviceHash: { userId, deviceHash: hash } } });
    if (known) {
      await this.prisma.knownDevice.update({ where: { id: known.id }, data: { lastSeenAt: new Date() } });
      return id;
    }
    const hadDevices = (await this.prisma.knownDevice.count({ where: { userId } })) > 0;
    const label = deviceLabel(userAgent);
    await this.prisma.knownDevice.create({ data: { userId, deviceHash: hash, label } });
    if (notify && hadDevices) await this.mailer.newLogin(await this.recipient(userId), label, new Date());
    return id;
  }

  async notifyPassphraseChanged(userId: string) {
    await this.mailer.passphraseChanged(await this.recipient(userId));
  }

  // ── Eliminar la cuenta ───────────────────────────────────────────────────────
  /**
   * Borra todo lo personal. Los hogares donde la persona es el único miembro se borran enteros.
   * Si comparte hogares, sus datos quedan para los demás (son del hogar) y la cuenta se
   * ANONIMIZA: se conserva solo su clave pública, para que los demás puedan seguir verificando
   * las claves del hogar que ella les compartió.
   */
  async deleteAccount(userId: string, password: string) {
    await this.checkPassword(userId, password);
    const r = await this.recipient(userId);
    const memberships = await this.prisma.householdMember.findMany({
      where: { userId },
      select: { householdId: true, role: true, household: { select: { _count: { select: { members: true } } } } },
    });
    const solo = memberships.filter((m) => m.household._count.members === 1).map((m) => m.householdId);
    const shared = memberships.filter((m) => m.household._count.members > 1);

    await this.prisma.$transaction(async (tx) => {
      await tx.household.deleteMany({ where: { id: { in: solo } } });
      const stillReferenced = await tx.transaction.count({ where: { createdById: userId } });
      if (shared.length === 0 && stillReferenced === 0) {
        await tx.user.delete({ where: { id: userId } });
        return;
      }
      // Si era dueño de un hogar compartido, el miembro más antiguo pasa a ser dueño
      for (const m of shared.filter((x) => x.role === 'OWNER')) {
        const next = await tx.householdMember.findFirst({ where: { householdId: m.householdId, userId: { not: userId } }, orderBy: { joinedAt: 'asc' } });
        if (next) await tx.householdMember.updateMany({ where: { householdId: m.householdId, userId: next.userId }, data: { role: 'OWNER' } });
      }
      await tx.householdMember.deleteMany({ where: { userId } });
      await Promise.all([
        tx.whatsappLink.deleteMany({ where: { userId } }),
        tx.receiptInboxItem.deleteMany({ where: { userId } }),
        tx.receiptEvent.deleteMany({ where: { userId } }),
        tx.subscription.deleteMany({ where: { userId } }),
        tx.notification.deleteMany({ where: { userId } }),
        tx.pushSubscription.deleteMany({ where: { userId } }),
        tx.accountToken.deleteMany({ where: { userId } }),
        tx.knownDevice.deleteMany({ where: { userId } }),
      ]);
      await tx.userKeys.update({ where: { userId }, data: { encryptedPrivateKeys: new Uint8Array(0), recoveryEncryptedKeys: new Uint8Array(0) } });
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `eliminada+${userId}@commit.invalid`,
          displayName: 'Cuenta eliminada',
          passwordHash: await this.hasher.hash(randomUUID()),
          emailVerifiedAt: null,
          defaultHouseholdId: null,
          deletedAt: new Date(),
        },
      });
    });
    await this.tokens.revokeAll(userId);
    await this.mailer.accountDeleted(r);
    this.logger.log(`Cuenta eliminada (${shared.length > 0 ? 'anonimizada: compartía hogares' : 'borrada por completo'})`);
  }
}
