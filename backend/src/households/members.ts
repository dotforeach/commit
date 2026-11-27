import { createHash, randomBytes } from 'node:crypto';
import { BadRequestException, Body, ConflictException, Controller, Delete, ForbiddenException, Get, HttpCode, Injectable, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Throttle } from '@nestjs/throttler';
import { z } from 'zod';
import { memberKeySignedMessage, verifyEd25519 } from '../auth/member-key-signature.js';
import { base64Bytes, toBase64 } from '../common/base64.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { HouseholdAccessService } from './household-access.service.js';

const uuid = { schema: z.uuid() };
const invite = z.object({ email: z.email().trim().toLowerCase().max(254), role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']) });
const accept = z.object({ token: z.string().min(20).max(200) });
const wrapped = z.object({ version: z.int().positive(), wrappedKey: base64Bytes({ exact: 80 }), signature: base64Bytes({ exact: 64 }) });
/** Acceso para un miembro: la clave del hogar en TODAS sus versiones (para leer lo ya cifrado). */
const grant = z.object({ keys: z.array(wrapped).min(1).max(100) });
const role = z.object({ role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']) });
/** Rotación: versión nueva de la clave, envuelta para cada miembro activo. */
const rotate = z.object({
  version: z.int().positive(),
  memberKeys: z.array(z.object({ userId: z.uuid(), wrappedKey: base64Bytes({ exact: 80 }), signature: base64Bytes({ exact: 64 }) })).min(1).max(100),
});
const defaultHousehold = z.object({ householdId: z.uuid() });

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
const INVITE_TTL = 7 * 24 * 3600 * 1000;

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  private async requireAdmin(householdId: string, userId: string) {
    const a = await this.access.require(householdId, userId, 'write');
    if (a.role !== 'OWNER' && a.role !== 'ADMIN') throw new ForbiddenException('Solo el dueño o un administrador puede hacer esto');
    return a;
  }

  async members(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.householdMember.findMany({
      where: { householdId },
      include: { user: { select: { id: true, email: true, displayName: true, keys: { select: { publicKey: true, signingPublicKey: true, keyVersion: true } } } } },
      orderBy: { joinedAt: 'asc' },
    });
    return {
      items: rows.map((m) => ({
        userId: m.userId,
        email: m.user.email,
        displayName: m.user.displayName,
        role: m.role,
        status: m.status,
        joinedAt: m.joinedAt,
        publicKey: m.user.keys ? toBase64(m.user.keys.publicKey) : null,
        signingPublicKey: m.user.keys ? toBase64(m.user.keys.signingPublicKey) : null,
        userKeyVersion: m.user.keys?.keyVersion ?? null,
      })),
    };
  }

  async invite(householdId: string, userId: string, input: z.infer<typeof invite>) {
    await this.requireAdmin(householdId, userId);
    const already = await this.prisma.householdMember.findFirst({ where: { householdId, user: { email: input.email } } });
    if (already) throw new ConflictException('Esa persona ya es miembro del hogar');
    const token = randomBytes(32).toString('base64url');
    const inv = await this.prisma.householdInvitation.create({
      data: { householdId, email: input.email, role: input.role, tokenHash: hashToken(token), invitedById: userId, expiresAt: new Date(Date.now() + INVITE_TTL) },
    });
    return { id: inv.id, token, email: inv.email, role: inv.role, expiresAt: inv.expiresAt };
  }

  async invitations(householdId: string, userId: string) {
    await this.requireAdmin(householdId, userId);
    const rows = await this.prisma.householdInvitation.findMany({
      where: { householdId, acceptedAt: null, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    return { items: rows.map((i) => ({ id: i.id, email: i.email, role: i.role, expiresAt: i.expiresAt })) };
  }

  async revoke(householdId: string, userId: string, id: string) {
    await this.requireAdmin(householdId, userId);
    await this.prisma.householdInvitation.updateMany({ where: { id, householdId, acceptedAt: null }, data: { revokedAt: new Date() } });
  }

  /** La persona invitada (con el mismo email) se suma al hogar, todavía sin acceso a la clave. */
  async accept(userId: string, token: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true, displayName: true } });
    return this.prisma.$transaction(async (tx) => {
      const inv = await tx.householdInvitation.findUnique({ where: { tokenHash: hashToken(token) } });
      if (!inv || inv.revokedAt || inv.acceptedAt || inv.expiresAt < new Date()) throw new NotFoundException('La invitación no existe, ya se usó o venció');
      if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new ForbiddenException('La invitación es para otro email');
      const { count } = await tx.householdInvitation.updateMany({ where: { id: inv.id, acceptedAt: null }, data: { acceptedAt: new Date() } });
      if (count === 0) throw new NotFoundException('La invitación ya se usó');
      const exists = await tx.householdMember.findUnique({ where: { householdId_userId: { householdId: inv.householdId, userId } } });
      if (exists) throw new ConflictException('Ya eres miembro de este hogar');
      await tx.householdMember.create({ data: { householdId: inv.householdId, userId, role: inv.role, status: 'PENDING_KEY' } });
      // Aviso (sin datos financieros) a los administradores: tienen que darle acceso.
      const admins = await tx.householdMember.findMany({ where: { householdId: inv.householdId, status: 'ACTIVE', role: { in: ['OWNER', 'ADMIN'] } }, select: { userId: true } });
      await tx.notification.createMany({
        data: admins.map((a) => ({
          userId: a.userId,
          householdId: inv.householdId,
          type: 'MEMBER_PENDING_KEY' as const,
          title: `${user.displayName} se sumó al hogar`,
          body: 'Verifica su huella y dale acceso desde Mi hogar.',
          dedupeKey: `pending:${inv.householdId}:${userId}`,
        })),
        skipDuplicates: true,
      });
      return { householdId: inv.householdId, status: 'PENDING_KEY' };
    });
  }

  /** Da acceso a un miembro pendiente: la clave del hogar (todas las versiones) envuelta y firmada por el admin. */
  async grant(householdId: string, adminId: string, targetUserId: string, input: z.infer<typeof grant>) {
    await this.requireAdmin(householdId, adminId);
    const [household, adminKeys, target] = await Promise.all([
      this.prisma.household.findUniqueOrThrow({ where: { id: householdId }, include: { keys: true } }),
      this.prisma.userKeys.findUniqueOrThrow({ where: { userId: adminId } }),
      this.prisma.householdMember.findUnique({ where: { householdId_userId: { householdId, userId: targetUserId } }, include: { user: { include: { keys: true } } } }),
    ]);
    if (!target || target.status !== 'PENDING_KEY' || !target.user.keys) throw new BadRequestException('Ese miembro no está esperando acceso');
    const versions = household.keys.map((k) => k.version).sort((a, b) => a - b);
    const sent = input.keys.map((k) => k.version).sort((a, b) => a - b);
    if (JSON.stringify(versions) !== JSON.stringify(sent)) throw new BadRequestException('Hay que enviar todas las versiones de la clave del hogar');
    for (const k of input.keys) {
      if (!verifyEd25519(adminKeys.signingPublicKey, memberKeySignedMessage(householdId, k.version, targetUserId, k.wrappedKey), k.signature)) {
        throw new BadRequestException('Firma inválida');
      }
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.householdMemberKey.deleteMany({ where: { householdId, userId: targetUserId } });
      await tx.householdMemberKey.createMany({
        data: input.keys.map((k) => ({
          householdId,
          version: k.version,
          userId: targetUserId,
          userKeyVersion: target.user.keys!.keyVersion,
          wrappedKey: k.wrappedKey,
          signature: k.signature,
          wrappedById: adminId,
        })),
      });
      await tx.householdMember.update({ where: { householdId_userId: { householdId, userId: targetUserId } }, data: { status: 'ACTIVE' } });
      await tx.notification.deleteMany({ where: { householdId, type: 'MEMBER_PENDING_KEY', dedupeKey: `pending:${householdId}:${targetUserId}` } });
    });
  }

  async setRole(householdId: string, adminId: string, targetUserId: string, newRole: z.infer<typeof role>['role']) {
    await this.requireAdmin(householdId, adminId);
    const target = await this.prisma.householdMember.findUnique({ where: { householdId_userId: { householdId, userId: targetUserId } } });
    if (!target) throw new NotFoundException('Miembro no encontrado');
    if (target.role === 'OWNER') throw new BadRequestException('El rol del dueño no se cambia');
    await this.prisma.householdMember.update({ where: { householdId_userId: { householdId, userId: targetUserId } }, data: { role: newRole } });
  }

  /** Quitar a un miembro (admin) o irse (uno mismo). Después, el cliente debe rotar la clave. */
  async remove(householdId: string, actorId: string, targetUserId: string) {
    const target = await this.prisma.householdMember.findUnique({ where: { householdId_userId: { householdId, userId: targetUserId } } });
    if (!target) throw new NotFoundException('Miembro no encontrado');
    if (target.role === 'OWNER') throw new BadRequestException('El dueño no puede salir ni ser quitado del hogar');
    if (actorId !== targetUserId) await this.requireAdmin(householdId, actorId);
    await this.prisma.$transaction(async (tx) => {
      await tx.householdMemberKey.deleteMany({ where: { householdId, userId: targetUserId } });
      await tx.householdMember.delete({ where: { householdId_userId: { householdId, userId: targetUserId } } });
      await tx.user.updateMany({ where: { id: targetUserId, defaultHouseholdId: householdId }, data: { defaultHouseholdId: null } });
    });
  }

  /** Nueva versión de la clave del hogar para los miembros activos (después de quitar a alguien). */
  async rotate(householdId: string, adminId: string, input: z.infer<typeof rotate>) {
    const { currentKeyVersion } = await this.requireAdmin(householdId, adminId);
    if (input.version !== currentKeyVersion + 1) throw new ConflictException('La clave ya cambió; recargá');
    const adminKeys = await this.prisma.userKeys.findUniqueOrThrow({ where: { userId: adminId } });
    const active = await this.prisma.householdMember.findMany({ where: { householdId, status: 'ACTIVE' }, include: { user: { include: { keys: true } } } });
    const ids = new Set(input.memberKeys.map((m) => m.userId));
    if (ids.size !== active.length || active.some((m) => !ids.has(m.userId))) throw new BadRequestException('La clave nueva tiene que ir para todos los miembros activos (y solo para ellos)');
    for (const m of input.memberKeys) {
      if (!verifyEd25519(adminKeys.signingPublicKey, memberKeySignedMessage(householdId, input.version, m.userId, m.wrappedKey), m.signature)) {
        throw new BadRequestException('Firma inválida');
      }
    }
    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.household.updateMany({ where: { id: householdId, currentKeyVersion }, data: { currentKeyVersion: input.version } });
      if (count === 0) throw new ConflictException('La clave ya cambió; recargá');
      await tx.householdKey.create({ data: { householdId, version: input.version } });
      await tx.householdMemberKey.createMany({
        data: input.memberKeys.map((m) => ({
          householdId,
          version: input.version,
          userId: m.userId,
          userKeyVersion: active.find((a) => a.userId === m.userId)!.user.keys!.keyVersion,
          wrappedKey: m.wrappedKey,
          signature: m.signature,
          wrappedById: adminId,
        })),
      });
    });
    return { currentKeyVersion: input.version };
  }

  async setDefault(userId: string, householdId: string) {
    const m = await this.prisma.householdMember.findUnique({ where: { householdId_userId: { householdId, userId } } });
    if (!m || m.status !== 'ACTIVE') throw new NotFoundException('Hogar no encontrado');
    await this.prisma.user.update({ where: { id: userId }, data: { defaultHouseholdId: householdId } });
  }
}

@Controller()
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Get('households/:householdId/members')
  list(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.members.members(hid, uid);
  }

  @Post('households/:householdId/invitations')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  invite(@Param('householdId', uuid) hid: string, @Body({ schema: invite }) body: z.infer<typeof invite>, @CurrentUser('id') uid: string) {
    return this.members.invite(hid, uid, body);
  }

  @Get('households/:householdId/invitations')
  invitations(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.members.invitations(hid, uid);
  }

  @Delete('households/:householdId/invitations/:id')
  @HttpCode(204)
  async revoke(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @CurrentUser('id') uid: string) {
    await this.members.revoke(hid, uid, id);
  }

  @Post('invitations/accept')
  @HttpCode(200)
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  accept(@Body({ schema: accept }) body: z.infer<typeof accept>, @CurrentUser('id') uid: string) {
    return this.members.accept(uid, body.token);
  }

  @Post('households/:householdId/members/:userId/key')
  @HttpCode(204)
  async grant(@Param('householdId', uuid) hid: string, @Param('userId', uuid) target: string, @Body({ schema: grant }) body: z.infer<typeof grant>, @CurrentUser('id') uid: string) {
    await this.members.grant(hid, uid, target, body);
  }

  @Put('households/:householdId/members/:userId')
  @HttpCode(204)
  async setRole(@Param('householdId', uuid) hid: string, @Param('userId', uuid) target: string, @Body({ schema: role }) body: z.infer<typeof role>, @CurrentUser('id') uid: string) {
    await this.members.setRole(hid, uid, target, body.role);
  }

  @Delete('households/:householdId/members/:userId')
  @HttpCode(204)
  async remove(@Param('householdId', uuid) hid: string, @Param('userId', uuid) target: string, @CurrentUser('id') uid: string) {
    await this.members.remove(hid, uid, target);
  }

  @Post('households/:householdId/keys/rotate')
  rotate(@Param('householdId', uuid) hid: string, @Body({ schema: rotate }) body: z.infer<typeof rotate>, @CurrentUser('id') uid: string) {
    return this.members.rotate(hid, uid, body);
  }

  @Put('me/default-household')
  @HttpCode(204)
  async setDefault(@Body({ schema: defaultHousehold }) body: z.infer<typeof defaultHousehold>, @CurrentUser('id') uid: string) {
    await this.members.setDefault(uid, body.householdId);
  }
}
