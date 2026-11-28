import { HttpErrorResponse } from '@angular/common/http';
import { shouldRetryWake, WAKE_DELAYS_MS } from './wake-retry.interceptor';

const err = (status: number) => new HttpErrorResponse({ status });

describe('reintentos mientras el backend despierta', () => {
  it('502 y 503 se reintentan siempre (el pedido no llegó al backend)', () => {
    expect(shouldRetryWake(err(502), 'POST', '/api/auth/login')).toBe(true);
    expect(shouldRetryWake(err(503), 'GET', '/api/me')).toBe(true);
  });
  it('504 solo en lecturas y en el refresh de sesión', () => {
    expect(shouldRetryWake(err(504), 'GET', '/api/me')).toBe(true);
    expect(shouldRetryWake(err(504), 'POST', '/api/auth/refresh')).toBe(true);
    expect(shouldRetryWake(err(504), 'POST', '/api/households/x/transactions')).toBe(false);
  });
  it('no reintenta errores de la app ni sin conexión', () => {
    for (const s of [0, 400, 401, 403, 404, 409, 429, 500]) expect(shouldRetryWake(err(s), 'GET', '/api/me')).toBe(false);
    expect(shouldRetryWake(new Error('x'), 'GET', '/api/me')).toBe(false);
  });
  it('cubre el arranque en frío medido (20-30 s)', () => {
    expect(WAKE_DELAYS_MS.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(40_000);
  });
});
