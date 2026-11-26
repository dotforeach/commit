import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuth } from './jwt-auth.provider.js';
import { RedisRefreshTokenStore } from './redis-refresh-token.store.js';

@Module({
  imports: [
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        accessToken: { key: config.get('JWT_SECRET', { infer: true }), ttl: '15m' },
        refreshToken: { ttl: '30d', absoluteTtl: '90d' },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuth, RedisRefreshTokenStore],
})
export class AuthModule {}
