import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationStorage,
  type RefreshTokenRecord,
  type RefreshTokenStore,
} from '@nestjs/authentication';
import type { Redis } from 'ioredis';
import { REDIS } from '../redis/redis.constants.js';

const tokenKey = (id: string) => `auth:rt:${id}`;
const familyRevokedKey = (familyId: string) => `auth:rtf:revoked:${familyId}`;
const userFamiliesKey = (userId: string) => `auth:rtu:${userId}`;

/** Las familias revocadas se recuerdan más que cualquier familia viva (absoluteTtl = 90d). */
const REVOCATION_TTL_SECONDS = 100 * 24 * 3600;

interface StoredRecord {
  id: string;
  familyId: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  familyExpiresAt: string;
  usedAt?: string;
  claims?: Record<string, unknown>;
}

/**
 * Marca el token como usado solo si existe y no estaba usado, en una sola operación atómica.
 * Devuelve 1 si esta llamada lo marcó.
 */
const MARK_USED_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
if not raw then return 0 end
local record = cjson.decode(raw)
if record.usedAt then return 0 end
record.usedAt = ARGV[1]
redis.call('SET', KEYS[1], cjson.encode(record), 'KEEPTTL')
return 1
`;

/** Store de refresh tokens en Redis para @nestjs/authentication. Los ids ya son SHA-256 del token. */
@Injectable()
export class RedisRefreshTokenStore implements RefreshTokenStore {
  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ refreshTokens: this });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const raw = await this.redis.get(tokenKey(id));
    if (!raw) return undefined;
    const stored = JSON.parse(raw) as StoredRecord;
    const record: RefreshTokenRecord = {
      id: stored.id,
      familyId: stored.familyId,
      userId: stored.userId,
      createdAt: new Date(stored.createdAt),
      expiresAt: new Date(stored.expiresAt),
      familyExpiresAt: new Date(stored.familyExpiresAt),
    };
    if (stored.usedAt) record.usedAt = new Date(stored.usedAt);
    if (stored.claims) record.claims = stored.claims;
    return record;
  }

  async saveRefreshToken(record: RefreshTokenRecord): Promise<void> {
    const stored: StoredRecord = {
      id: record.id,
      familyId: record.familyId,
      userId: record.userId,
      createdAt: record.createdAt.toISOString(),
      expiresAt: record.expiresAt.toISOString(),
      familyExpiresAt: record.familyExpiresAt.toISOString(),
      ...(record.usedAt ? { usedAt: record.usedAt.toISOString() } : {}),
      ...(record.claims ? { claims: record.claims } : {}),
    };
    // Redis borra solo el token cuando vence la familia: el store queda acotado.
    const ttlMs = Math.max(record.familyExpiresAt.getTime() - Date.now(), 1000);
    await this.redis
      .multi()
      .set(tokenKey(record.id), JSON.stringify(stored), 'PX', ttlMs)
      .sadd(userFamiliesKey(record.userId), record.familyId)
      .pexpire(userFamiliesKey(record.userId), REVOCATION_TTL_SECONDS * 1000)
      .exec();
  }

  async markRefreshTokenUsed(id: string, at: Date): Promise<boolean> {
    const result = await this.redis.eval(MARK_USED_SCRIPT, 1, tokenKey(id), at.toISOString());
    return result === 1;
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    await this.redis.set(familyRevokedKey(familyId), '1', 'EX', REVOCATION_TTL_SECONDS);
  }

  async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
    return (await this.redis.exists(familyRevokedKey(familyId))) === 1;
  }

  async revokeUserRefreshTokens(userId: string): Promise<void> {
    const families = await this.redis.smembers(userFamiliesKey(userId));
    if (families.length === 0) return;
    const pipeline = this.redis.pipeline();
    for (const familyId of families) {
      pipeline.set(familyRevokedKey(familyId), '1', 'EX', REVOCATION_TTL_SECONDS);
    }
    await pipeline.exec();
  }
}
