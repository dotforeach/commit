import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { deleteQuerySchema } from '../accounts/accounts.schemas.js';
import { createBudgetSchema, updateBudgetSchema, type CreateBudgetInput, type UpdateBudgetInput } from './budgets.schemas.js';
import { BudgetsService } from './budgets.service.js';

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/budgets')
export class BudgetsController {
  constructor(private readonly budgets: BudgetsService) {}

  @Get()
  list(@Param('householdId', uuid) householdId: string, @CurrentUser('id') userId: string) {
    return this.budgets.list(householdId, userId);
  }

  @Post()
  create(
    @Param('householdId', uuid) householdId: string,
    @Body({ schema: createBudgetSchema }) body: CreateBudgetInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.budgets.create(householdId, userId, body);
  }

  @Put(':id')
  update(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Body({ schema: updateBudgetSchema }) body: UpdateBudgetInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.budgets.update(householdId, userId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Query({ schema: deleteQuerySchema }) query: z.infer<typeof deleteQuerySchema>,
    @CurrentUser('id') userId: string,
  ) {
    await this.budgets.remove(householdId, userId, id, query.expectedRevision);
  }
}
