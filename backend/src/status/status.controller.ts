import { timingSafeEqual } from 'node:crypto';
import { Controller, Get, Headers, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '@nestjs/authentication';
import { SkipThrottle } from '@nestjs/throttler';
import type { Env } from '../config/env.schema.js';
import { StatusService } from './status.service.js';

/**
 * Estado de la infraestructura. En desarrollo, abierto; en producción solo con el token de
 * operador (STATUS_TOKEN) y, si no lo hay o no coincide, responde 404 (no revela que existe).
 */
@Controller('status')
export class StatusController {
  constructor(
    private readonly status: StatusService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Public()
  @SkipThrottle()
  @Get()
  get(@Headers('x-status-token') token: string | undefined) {
    if (this.config.get('NODE_ENV', { infer: true }) === 'production' && !this.validToken(token)) throw new NotFoundException();
    return this.status.snapshot();
  }

  private validToken(given: string | undefined) {
    const expected = this.config.get('STATUS_TOKEN', { infer: true });
    if (!expected || !given) return false;
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }
}
