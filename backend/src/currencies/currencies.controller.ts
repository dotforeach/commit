import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

/** Catálogo público de monedas. */
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.currency.findMany({ orderBy: [{ isCrypto: 'asc' }, { code: 'asc' }] });
  }
}
