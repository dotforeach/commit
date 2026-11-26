import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { deleteQuerySchema } from '../accounts/accounts.schemas.js';
import {
  createRuleSchema,
  postOccurrencesSchema,
  updateRuleSchema,
  type CreateRuleInput,
  type PostOccurrencesInput,
  type UpdateRuleInput,
} from './recurring.schemas.js';
import { RecurringService } from './recurring.service.js';

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/recurring-rules')
export class RecurringController {
  constructor(private readonly recurring: RecurringService) {}

  @Get()
  list(@Param('householdId', uuid) householdId: string, @CurrentUser('id') userId: string) {
    return this.recurring.list(householdId, userId);
  }

  @Post()
  create(
    @Param('householdId', uuid) householdId: string,
    @Body({ schema: createRuleSchema }) body: CreateRuleInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.recurring.create(householdId, userId, body);
  }

  @Put(':id')
  update(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Body({ schema: updateRuleSchema }) body: UpdateRuleInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.recurring.update(householdId, userId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Query({ schema: deleteQuerySchema }) query: z.infer<typeof deleteQuerySchema>,
    @CurrentUser('id') userId: string,
  ) {
    await this.recurring.remove(householdId, userId, id, query.expectedRevision);
  }

  @Post(':id/occurrences')
  @HttpCode(200)
  postOccurrences(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Body({ schema: postOccurrencesSchema }) body: PostOccurrencesInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.recurring.postOccurrences(householdId, userId, id, body);
  }
}
