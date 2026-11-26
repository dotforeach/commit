import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { createPlanSchema, type CreatePlanInput } from './installments.schemas.js';
import { InstallmentsService } from './installments.service.js';

const uuid = { schema: z.uuid() };

/** Para borrar una compra en cuotas se borra su movimiento (DELETE /transactions/:id). */
@Controller('households/:householdId/installment-plans')
export class InstallmentsController {
  constructor(private readonly installments: InstallmentsService) {}

  @Get()
  list(@Param('householdId', uuid) householdId: string, @CurrentUser('id') userId: string) {
    return this.installments.list(householdId, userId);
  }

  @Post()
  create(@Param('householdId', uuid) householdId: string, @Body({ schema: createPlanSchema }) body: CreatePlanInput, @CurrentUser('id') userId: string) {
    return this.installments.create(householdId, userId, body);
  }
}
