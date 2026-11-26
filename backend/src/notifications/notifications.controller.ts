import { Body, ConflictException, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { toBase64 } from '../common/base64.js';
import { encryptedPayload, keyVersion } from '../common/encrypted.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from './push.service.js';

const uuid = { schema: z.uuid() };
const subscription = z.object({
  endpoint: z.url().max(2000),
  keys: z.object({ p256dh: z.string().min(10).max(200), auth: z.string().min(8).max(100) }),
});
const unsubscribe = z.object({ endpoint: z.url().max(2000) });
const markRead = z.object({ ids: z.array(z.uuid()).max(200).optional() });
/** payload: { title, body, link } (cifrado con la clave del hogar) */
const createReminder = z.object({
  id: z.uuid(),
  sourceId: z.uuid().nullable(),
  remindAt: z.iso.datetime({ offset: true }).transform((s) => new Date(s)),
  payload: encryptedPayload,
  keyVersion,
});

@Controller()
export class NotificationsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
    private readonly push: PushService,
  ) {}

  @Get('push/public-key')
  publicKey() {
    return { publicKey: this.push.publicKey() };
  }

  @Post('me/push-subscriptions')
  @HttpCode(204)
  async subscribe(@Body({ schema: subscription }) body: z.infer<typeof subscription>, @CurrentUser('id') userId: string) {
    // Un endpoint pertenece a un navegador: si cambia de usuario, se reasigna.
    await this.prisma.pushSubscription.upsert({
      where: { endpoint: body.endpoint },
      create: { userId, endpoint: body.endpoint, p256dh: body.keys.p256dh, auth: body.keys.auth },
      update: { userId, p256dh: body.keys.p256dh, auth: body.keys.auth },
    });
  }

  @Post('me/push-subscriptions/remove')
  @HttpCode(204)
  async unsubscribe(@Body({ schema: unsubscribe }) body: z.infer<typeof unsubscribe>, @CurrentUser('id') userId: string) {
    await this.prisma.pushSubscription.deleteMany({ where: { endpoint: body.endpoint, userId } });
  }

  @Get('me/notifications')
  async notifications(@CurrentUser('id') userId: string) {
    const rows = await this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 50 });
    return {
      items: rows.map((n) => ({
        id: n.id,
        householdId: n.householdId,
        reminderId: n.reminderId,
        type: n.type,
        title: n.title,
        body: n.body,
        payload: n.payload ? toBase64(n.payload) : null,
        keyVersion: n.keyVersion,
        readAt: n.readAt,
        createdAt: n.createdAt,
      })),
    };
  }

  @Post('me/notifications/read')
  @HttpCode(204)
  async read(@Body({ schema: markRead }) body: z.infer<typeof markRead>, @CurrentUser('id') userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, readAt: null, ...(body.ids ? { id: { in: body.ids } } : {}) }, data: { readAt: new Date() } });
  }

  /** Recordatorios pendientes del hogar (para no duplicarlos al programar). */
  @Get('households/:householdId/reminders')
  async reminders(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    await this.access.require(hid, uid, 'read');
    const rows = await this.prisma.reminder.findMany({ where: { householdId: hid, deletedAt: null, firedAt: null }, orderBy: { remindAt: 'asc' } });
    return { items: rows.map((r) => ({ id: r.id, sourceId: r.sourceId, remindAt: r.remindAt })) };
  }

  @Post('households/:householdId/reminders')
  async createReminder(@Param('householdId', uuid) hid: string, @Body({ schema: createReminder }) body: z.infer<typeof createReminder>, @CurrentUser('id') uid: string) {
    const { currentKeyVersion } = await this.access.require(hid, uid, 'write');
    if (body.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    await this.prisma.reminder.create({ data: { ...body, householdId: hid, createdById: uid } });
    return { id: body.id };
  }

  @Delete('households/:householdId/reminders/:id')
  @HttpCode(204)
  async removeReminder(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @CurrentUser('id') uid: string) {
    await this.access.require(hid, uid, 'write');
    await this.prisma.reminder.updateMany({ where: { id, householdId: hid, deletedAt: null }, data: { deletedAt: new Date() } });
  }
}
