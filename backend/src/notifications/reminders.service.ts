import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PushService } from './push.service.js';

interface DueReminder {
  id: string;
  householdId: string;
  payload: Uint8Array<ArrayBuffer>;
  keyVersion: number;
}

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly push: PushService,
  ) {}

  /**
   * Dispara los recordatorios vencidos: los reclama en una sola sentencia (SKIP LOCKED: dos
   * instancias nunca toman el mismo), crea una notificación (con el payload cifrado) por cada
   * miembro activo del hogar y manda un push genérico. Devuelve cuántos disparó.
   */
  async fireDue(now = new Date()): Promise<number> {
    const due = await this.prisma.$queryRaw<DueReminder[]>`
      UPDATE reminders SET "firedAt" = ${now}
      WHERE id IN (
        SELECT id FROM reminders
        WHERE "firedAt" IS NULL AND "deletedAt" IS NULL AND "remindAt" <= ${now}
        ORDER BY "remindAt" LIMIT 200
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, "householdId", payload, "keyVersion"`;
    for (const r of due) {
      const members = await this.prisma.householdMember.findMany({ where: { householdId: r.householdId, status: 'ACTIVE' }, select: { userId: true } });
      await this.prisma.notification.createMany({
        data: members.map((m) => ({
          userId: m.userId,
          householdId: r.householdId,
          reminderId: r.id,
          type: 'REMINDER' as const,
          payload: r.payload,
          keyVersion: r.keyVersion,
          dedupeKey: `reminder:${r.id}`,
        })),
        skipDuplicates: true,
      });
      for (const m of members) await this.push.notify(m.userId, 'Tienes un recordatorio');
    }
    if (due.length > 0) this.logger.log(`Recordatorios disparados: ${due.length}`);
    return due.length;
  }
}
