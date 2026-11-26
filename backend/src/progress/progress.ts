import { Body, ConflictException, Controller, Delete, Get, HttpCode, Injectable, Module, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { toBase64 } from '../common/base64.js';
import { encryptedPayload, keyVersion } from '../common/encrypted.js';
import { isoDate, toIsoDate } from '../common/sync.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { HouseholdsModule } from '../households/households.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

const uuid = { schema: z.uuid() };
const onboarding = z.object({ step: z.int().min(0).max(20), completed: z.boolean() });
/** payload: { score, components } */
const score = z.object({ payload: encryptedPayload, keyVersion });
/** payload: { milestoneKey } */
const milestone = z.object({ id: z.uuid(), payload: encryptedPayload, keyVersion });
const tipKey = z.string().regex(/^[a-z0-9_.-]{1,64}$/);

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  async setOnboarding(userId: string, input: z.infer<typeof onboarding>) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: input.step, onboardingCompletedAt: input.completed ? new Date() : null },
      select: { onboardingStep: true, onboardingCompletedAt: true },
    });
    return user;
  }

  async scores(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.financialHealthScore.findMany({ where: { householdId, deletedAt: null }, orderBy: { date: 'asc' }, take: 400 });
    return { items: rows.map((r) => ({ id: r.id, date: toIsoDate(r.date), payload: toBase64(r.payload), keyVersion: r.keyVersion })) };
  }

  /** Un puntaje por día: se crea o se reemplaza el del día. */
  async saveScore(householdId: string, userId: string, date: Date, input: z.infer<typeof score>, id: string) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    const existing = await this.prisma.financialHealthScore.findUnique({ where: { householdId_date: { householdId, date } } });
    if (existing && existing.id !== id) throw new ConflictException({ message: 'Ya hay un puntaje para ese día', id: existing.id });
    await this.prisma.financialHealthScore.upsert({
      where: { householdId_date: { householdId, date } },
      create: { id, householdId, date, payload: input.payload, keyVersion: input.keyVersion },
      update: { payload: input.payload, keyVersion: input.keyVersion, deletedAt: null },
    });
    return { id, date: toIsoDate(date) };
  }

  async milestones(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.milestoneCompletion.findMany({ where: { householdId, deletedAt: null }, orderBy: { completedAt: 'asc' } });
    return { items: rows.map((r) => ({ id: r.id, completedAt: r.completedAt, payload: toBase64(r.payload), keyVersion: r.keyVersion })) };
  }

  async addMilestone(householdId: string, userId: string, input: z.infer<typeof milestone>) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    const row = await this.prisma.milestoneCompletion.create({ data: { id: input.id, householdId, payload: input.payload, keyVersion: input.keyVersion } });
    return { id: row.id, completedAt: row.completedAt };
  }

  async tips(userId: string) {
    const rows = await this.prisma.tipDismissal.findMany({ where: { userId } });
    return { dismissed: rows.map((r) => r.tipKey) };
  }

  async dismissTip(userId: string, key: string) {
    await this.prisma.tipDismissal.upsert({ where: { userId_tipKey: { userId, tipKey: key } }, create: { userId, tipKey: key }, update: {} });
  }

  async restoreTip(userId: string, key: string) {
    await this.prisma.tipDismissal.deleteMany({ where: { userId, tipKey: key } });
  }
}

@Controller()
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Put('me/onboarding')
  onboarding(@Body({ schema: onboarding }) body: z.infer<typeof onboarding>, @CurrentUser('id') uid: string) {
    return this.progress.setOnboarding(uid, body);
  }

  @Get('me/tips')
  tips(@CurrentUser('id') uid: string) {
    return this.progress.tips(uid);
  }

  @Post('me/tips/:key/dismiss')
  @HttpCode(204)
  async dismiss(@Param('key', { schema: tipKey }) key: string, @CurrentUser('id') uid: string) {
    await this.progress.dismissTip(uid, key);
  }

  @Delete('me/tips/:key/dismiss')
  @HttpCode(204)
  async restore(@Param('key', { schema: tipKey }) key: string, @CurrentUser('id') uid: string) {
    await this.progress.restoreTip(uid, key);
  }

  @Get('households/:householdId/health-scores')
  scores(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.progress.scores(hid, uid);
  }

  @Put('households/:householdId/health-scores/:date/:id')
  saveScore(
    @Param('householdId', uuid) hid: string,
    @Param('date', { schema: isoDate }) date: Date,
    @Param('id', uuid) id: string,
    @Body({ schema: score }) body: z.infer<typeof score>,
    @CurrentUser('id') uid: string,
  ) {
    return this.progress.saveScore(hid, uid, date, body, id);
  }

  @Get('households/:householdId/milestones')
  milestones(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.progress.milestones(hid, uid);
  }

  @Post('households/:householdId/milestones')
  addMilestone(@Param('householdId', uuid) hid: string, @Body({ schema: milestone }) body: z.infer<typeof milestone>, @CurrentUser('id') uid: string) {
    return this.progress.addMilestone(hid, uid, body);
  }
}

@Module({ imports: [HouseholdsModule], controllers: [ProgressController], providers: [ProgressService] })
export class ProgressModule {}
