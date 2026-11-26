import 'dotenv/config';
import { AuthenticationStorage } from '@nestjs/authentication';
import { authenticationStoreContract } from '@nestjs/authentication/testing';
import { Redis } from 'ioredis';
import { RedisRefreshTokenStore } from '../src/auth/redis-refresh-token.store.js';

const redis = new Redis(process.env.REDIS_URL!);

afterAll(async () => {
  await redis.quit();
});

describe('RedisRefreshTokenStore (contrato oficial de @nestjs/authentication)', () => {
  const cases = authenticationStoreContract(
    () => ({ refreshTokens: new RedisRefreshTokenStore(redis, new AuthenticationStorage()) }),
    { contracts: ['refreshTokens'], concurrent: true },
  );

  for (const c of cases) {
    it(c.name, () => c.run());
  }
});
