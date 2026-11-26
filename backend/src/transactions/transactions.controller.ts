import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { syncQuerySchema, type SyncQuery } from '../common/sync.js';
import { deleteQuerySchema } from '../accounts/accounts.schemas.js';
import {
  createTransactionsSchema,
  updateTransactionsSchema,
  type CreateTransactionsInput,
  type UpdateTransactionsInput,
} from './transactions.schemas.js';
import { TransactionsService } from './transactions.service.js';

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/transactions')
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}

  @Get()
  list(
    @Param('householdId', uuid) householdId: string,
    @Query({ schema: syncQuerySchema }) query: SyncQuery,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactions.list(householdId, userId, query);
  }

  /** 1 movimiento, o las 2 patas de una transferencia. */
  @Post()
  create(
    @Param('householdId', uuid) householdId: string,
    @Body({ schema: createTransactionsSchema }) body: CreateTransactionsInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactions.create(householdId, userId, body);
  }

  @Put()
  update(
    @Param('householdId', uuid) householdId: string,
    @Body({ schema: updateTransactionsSchema }) body: UpdateTransactionsInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactions.update(householdId, userId, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Query({ schema: deleteQuerySchema }) query: z.infer<typeof deleteQuerySchema>,
    @CurrentUser('id') userId: string,
  ) {
    await this.transactions.remove(householdId, userId, id, query.expectedRevision);
  }
}
