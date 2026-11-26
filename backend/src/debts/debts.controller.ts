import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { deleteQuerySchema } from '../accounts/accounts.schemas.js';
import {
  createDebtSchema,
  createPaymentSchema,
  updateDebtSchema,
  type CreateDebtInput,
  type CreatePaymentInput,
  type UpdateDebtInput,
} from './debts.schemas.js';
import { DebtsService } from './debts.service.js';

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/debts')
export class DebtsController {
  constructor(private readonly debts: DebtsService) {}

  @Get()
  list(@Param('householdId', uuid) householdId: string, @CurrentUser('id') userId: string) {
    return this.debts.list(householdId, userId);
  }

  @Post()
  create(@Param('householdId', uuid) householdId: string, @Body({ schema: createDebtSchema }) body: CreateDebtInput, @CurrentUser('id') userId: string) {
    return this.debts.create(householdId, userId, body);
  }

  @Put(':id')
  update(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Body({ schema: updateDebtSchema }) body: UpdateDebtInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.debts.update(householdId, userId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Query({ schema: deleteQuerySchema }) query: z.infer<typeof deleteQuerySchema>,
    @CurrentUser('id') userId: string,
  ) {
    await this.debts.remove(householdId, userId, id, query.expectedRevision);
  }

  @Post(':id/payments')
  addPayment(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Body({ schema: createPaymentSchema }) body: CreatePaymentInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.debts.addPayment(householdId, userId, id, body);
  }

  @Delete(':id/payments/:paymentId')
  removePayment(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Param('paymentId', uuid) paymentId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.debts.removePayment(householdId, userId, id, paymentId);
  }
}
