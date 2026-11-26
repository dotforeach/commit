import { keyUpdateSignedMessage } from './key-update';
import { getSodium } from './sodium';

// Mismo vector que backend/src/users/key-update-signature.spec.ts.
const VECTOR = {
  userId: '0190f3a4-0000-7000-8000-000000000001',
  keyVersion: 1,
  encryptedPrivateKeys: Uint8Array.from({ length: 41 }, (_, i) => i),
  kdfSalt: Uint8Array.from({ length: 16 }, (_, i) => 255 - i),
  kdfParams: { alg: 'argon2id13' as const, opsLimit: 3, memLimit: 134217728 },
};
const EXPECTED_HEX =
  '66696e616e7a61733a7570646174652d6b6579733a76313a30313930663361342d303030302d373030302d383030302d3030303030303030303030313a313ad101b63a7abc16a534fd35e7676988267c3aa1ccb5f45dc4906ab554c0f279c8';

describe('keyUpdateSignedMessage', () => {
  it('coincide byte a byte con el backend', async () => {
    const { userId, keyVersion, ...fields } = VECTOR;
    const s = await getSodium();
    expect(s.to_hex(await keyUpdateSignedMessage(userId, keyVersion, fields))).toBe(EXPECTED_HEX);
  });
});
