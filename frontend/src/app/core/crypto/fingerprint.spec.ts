import { keyFingerprint } from './fingerprint';
import { generateIdentity } from './identity';

describe('huella de claves', () => {
  it('es estable para las mismas claves y distinta para otras', async () => {
    const a = await generateIdentity();
    const b = await generateIdentity();
    const fa = await keyFingerprint(a.boxPublicKey, a.signPublicKey);
    expect(fa).toMatch(/^([0-9A-F]{4} ){7}[0-9A-F]{4}$/);
    expect(await keyFingerprint(a.boxPublicKey, a.signPublicKey)).toBe(fa);
    expect(await keyFingerprint(b.boxPublicKey, b.signPublicKey)).not.toBe(fa);
  });
});
