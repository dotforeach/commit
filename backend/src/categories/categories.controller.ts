import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { toBase64 } from '../common/base64.js';
import { HouseholdAccessService } from '../households/household-access.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** Categorías del hogar (nombre e ícono cifrados). Por ahora solo lectura. */
@Controller('households/:householdId/categories')
export class CategoriesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: HouseholdAccessService,
  ) {}

  @Get()
  async list(@Param('householdId', { schema: z.uuid() }) householdId: string, @CurrentUser('id') userId: string) {
    await this.access.require(householdId, userId, 'read');
    const rows = await this.prisma.category.findMany({
      where: { householdId, deletedAt: null },
      orderBy: { id: 'asc' },
    });
    return {
      items: rows.map((c) => ({
        id: c.id,
        parentId: c.parentId,
        kind: c.kind,
        budgetGroup: c.budgetGroup,
        systemKey: c.systemKey,
        archivedAt: c.archivedAt,
        payload: toBase64(c.payload),
        keyVersion: c.keyVersion,
        revision: c.revision.toString(),
      })),
    };
  }
}
