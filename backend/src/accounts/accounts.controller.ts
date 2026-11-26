import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import {
  createAccountSchema,
  deleteQuerySchema,
  listQuerySchema,
  updateAccountSchema,
  type CreateAccountInput,
  type UpdateAccountInput,
} from './accounts.schemas.js';
import { AccountsService } from './accounts.service.js';

const uuid = { schema: z.uuid() };

@Controller('households/:householdId/accounts')
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Get()
  list(
    @Param('householdId', uuid) householdId: string,
    @Query({ schema: listQuerySchema }) query: z.infer<typeof listQuerySchema>,
    @CurrentUser('id') userId: string,
  ) {
    return this.accounts.list(householdId, userId, query.since);
  }

  @Post()
  create(
    @Param('householdId', uuid) householdId: string,
    @Body({ schema: createAccountSchema }) body: CreateAccountInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.accounts.create(householdId, userId, body);
  }

  @Put(':id')
  update(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Body({ schema: updateAccountSchema }) body: UpdateAccountInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.accounts.update(householdId, userId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('householdId', uuid) householdId: string,
    @Param('id', uuid) id: string,
    @Query({ schema: deleteQuerySchema }) query: z.infer<typeof deleteQuerySchema>,
    @CurrentUser('id') userId: string,
  ) {
    await this.accounts.remove(householdId, userId, id, query.expectedRevision);
  }
}
