import type { CookieOptions, Response } from 'express';

export const REFRESH_COOKIE = 'rt';

/**
 * El refresh token viaja solo en esta cookie: HttpOnly (el JS de la página no la ve),
 * SameSite=Strict (no se envía desde otros sitios) y limitada a las rutas de auth.
 */
const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
});

export function setRefreshCookie(res: Response, token: string, maxAgeMs: number) {
  res.cookie(REFRESH_COOKIE, token, { ...cookieOptions(), maxAge: maxAgeMs });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
}
