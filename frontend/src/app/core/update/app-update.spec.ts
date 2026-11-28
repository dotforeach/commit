import { isChunkLoadError } from './app-update.service';

describe('errores de carga de pantallas', () => {
  it('reconoce los mensajes de Chrome, Safari y Firefox', () => {
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/chunk-ABC.js'))).toBe(true);
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(isChunkLoadError(new TypeError('error loading dynamically imported module'))).toBe(true);
  });
  it('no confunde otros errores', () => {
    expect(isChunkLoadError(new Error('Http failure response for /api/me: 401'))).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
  });
});
