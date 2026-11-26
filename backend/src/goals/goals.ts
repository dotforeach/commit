import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, Injectable, Module, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { deleteQuerySchema } from '../accounts/accounts.schemas.js';
import { toBase64 } from '../common/base64.js';
import { encryptedPayload, keyVersion } from '../common/encrypted.js';
import { isoDate, toIsoDate } from '../common/sync.js';
import type { GoalContribution, SavingsGoal } from '../generated/prisma/client.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { HouseholdsModule } from '../households/households.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** payload: { name, targetAmount, monthsOfExpenses } */
const goalFields = {
  accountId: z.uuid().nullable(),
  kind: z.enum(['EMERGENCY_FUND', 'SAVINGS_GOAL', 'RETIREMENT']),
  currency: z.string().trim().toUpperCase().min(3).max(10),
  targetDate: isoDate.nullable(),
  priority: z.int().min(0).max(100),
  status: z.enum(['ACTIVE', 'ACHIEVED', 'PAUSED', 'CANCELLED']),
  payload: encryptedPayload,
  keyVersion,
};
const createGoal = z.object({ id: z.uuid(), ...goalFields });
const updateGoal = z.object({ expectedRevision: z.coerce.bigint(), ...goalFields });
/** payload: { amount (negativo = retiro), note } */
const createContribution = z.object({ id: z.uuid(), date: isoDate, payload: encryptedPayload, keyVersion });

const dto = (g: SavingsGoal & { contributions: GoalContribution[] }) => ({
  id: g.id,
  accountId: g.accountId,
  kind: g.kind,
  currency: g.currency,
  targetDate: g.targetDate ? toIsoDate(g.targetDate) : null,
  priority: g.priority,
  status: g.status,
  payload: toBase64(g.payload),
  keyVersion: g.keyVersion,
  revision: g.revision.toString(),
  contributions: g.contributions
    .filter((c) => !c.deletedAt)
    .map((c) => ({ id: c.id, date: toIsoDate(c.date), payload: toBase64(c.payload), keyVersion: c.keyVersion })),
});

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  private get(householdId: string, id: string) {
    return this.prisma.savingsGoal
      .findFirstOrThrow({ where: { id, householdId }, include: { contributions: { orderBy: { date: 'asc' } } } })
      .then(dto);
  }

  async list(householdId: string, userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.savingsGoal.findMany({
      where: { householdId, deletedAt: null },
      include: { contributions: { orderBy: { date: 'asc' } } },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
    return { items: rows.map(dto) };
  }

  async create(householdId: string, userId: string, input: z.infer<typeof createGoal>) {
    await this.validate(householdId, userId, input);
    const { id, ...data } = input;
    await this.prisma.savingsGoal.create({ data: { id, householdId, ...data } }).catch((e: unknown) => {
      if ((e as { code?: string }).code === 'P2002') throw new ConflictException('Ya existe esa meta');
      throw e;
    });
    return this.get(householdId, id);
  }

  async update(householdId: string, userId: string, id: string, input: z.infer<typeof updateGoal>) {
    await this.validate(householdId, userId, input);
    const { expectedRevision, ...data } = input;
    const { count } = await this.prisma.savingsGoal.updateMany({ where: { id, householdId, revision: expectedRevision, deletedAt: null }, data });
    if (count === 0) await this.notFoundOrConflict(householdId, id);
    return this.get(householdId, id);
  }

  async remove(householdId: string, userId: string, id: string, expectedRevision: bigint) {
    await this.access.require(householdId, userId, 'write');
    const { count } = await this.prisma.savingsGoal.updateMany({
      where: { id, householdId, revision: expectedRevision, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (count === 0) await this.notFoundOrConflict(householdId, id);
  }

  async contribute(householdId: string, userId: string, goalId: string, input: z.infer<typeof createContribution>) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    const goal = await this.prisma.savingsGoal.findFirst({ where: { id: goalId, householdId, deletedAt: null } });
    if (!goal) throw new NotFoundException('Meta no encontrada');
    await this.prisma.goalContribution.create({ data: { id: input.id, householdId, goalId, date: input.date, payload: input.payload, keyVersion: input.keyVersion } });
    return this.get(householdId, goalId);
  }

  async removeContribution(householdId: string, userId: string, goalId: string, contributionId: string) {
    await this.access.require(householdId, userId, 'write');
    const { count } = await this.prisma.goalContribution.updateMany({
      where: { id: contributionId, goalId, householdId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (count === 0) throw new NotFoundException('Aporte no encontrado');
    return this.get(householdId, goalId);
  }

  private async validate(householdId: string, userId: string, input: { currency: string; keyVersion: number; accountId: string | null }) {
    const { currentKeyVersion } = await this.access.require(householdId, userId, 'write');
    if (input.keyVersion !== currentKeyVersion) throw new ConflictException('La clave del hogar cambió; recargá');
    if (!(await this.prisma.currency.findUnique({ where: { code: input.currency } }))) throw new BadRequestException('Moneda desconocida');
    if (input.accountId) {
      const a = await this.prisma.account.findFirst({ where: { id: input.accountId, householdId, deletedAt: null } });
      if (!a) throw new BadRequestException('Cuenta inexistente en este hogar');
      if (a.currency !== input.currency) throw new BadRequestException('La cuenta vinculada tiene que estar en la moneda de la meta');
    }
  }

  private async notFoundOrConflict(householdId: string, id: string): Promise<never> {
    const exists = await this.prisma.savingsGoal.findFirst({ where: { id, householdId, deletedAt: null }, select: { id: true } });
    if (!exists) throw new NotFoundException('Meta no encontrada');
    throw new ConflictException('La meta cambió mientras la editabas; recargá');
  }
}

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/goals')
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}

  @Get()
  list(@Param('householdId', uuid) hid: string, @CurrentUser('id') uid: string) {
    return this.goals.list(hid, uid);
  }

  @Post()
  create(@Param('householdId', uuid) hid: string, @Body({ schema: createGoal }) body: z.infer<typeof createGoal>, @CurrentUser('id') uid: string) {
    return this.goals.create(hid, uid, body);
  }

  @Put(':id')
  update(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Body({ schema: updateGoal }) body: z.infer<typeof updateGoal>, @CurrentUser('id') uid: string) {
    return this.goals.update(hid, uid, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Query({ schema: deleteQuerySchema }) q: z.infer<typeof deleteQuerySchema>, @CurrentUser('id') uid: string) {
    await this.goals.remove(hid, uid, id, q.expectedRevision);
  }

  @Post(':id/contributions')
  contribute(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Body({ schema: createContribution }) body: z.infer<typeof createContribution>, @CurrentUser('id') uid: string) {
    return this.goals.contribute(hid, uid, id, body);
  }

  @Delete(':id/contributions/:cid')
  removeContribution(@Param('householdId', uuid) hid: string, @Param('id', uuid) id: string, @Param('cid', uuid) cid: string, @CurrentUser('id') uid: string) {
    return this.goals.removeContribution(hid, uid, id, cid);
  }
}

@Module({ imports: [HouseholdsModule], controllers: [GoalsController], providers: [GoalsService] })
export class GoalsModule {}
