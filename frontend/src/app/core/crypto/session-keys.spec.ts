import { packIdentity, unpackIdentity } from './session-keys';

describe('session-keys', () => {
  it('serializa y recupera las 4 claves sin perder bytes', () => {
    const fill = (n: number, v: number) => new Uint8Array(n).fill(v);
    const identity = { boxPublicKey: fill(32, 1), boxSecretKey: fill(32, 2), signPublicKey: fill(32, 3), signSecretKey: fill(64, 4) };
    const back = unpackIdentity(packIdentity(identity));
    expect(back).toEqual(identity);
  });

  it('rechaza datos con formato inválido', () => {
    expect(() => unpackIdentity(new Uint8Array([0, 1, 9]))).toThrow();
  });
});
