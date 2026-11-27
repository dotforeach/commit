import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Public, TokenService } from '@nestjs/authentication';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { credentialsSchema, registerSchema, type Credentials, type RegisterInput } from './auth.schemas.js';
import { AuthService } from './auth.service.js';
import { AccountService } from './account.service.js';
import { clearRefreshCookie, DEVICE_COOKIE, REFRESH_COOKIE, setDeviceCookie, setRefreshCookie } from './refresh-cookie.js';

const REFRESH_TTL_MS = 30 * 24 * 3600 * 1000;

/** Límite estricto (por IP) solo donde se prueban credenciales; refresh y logout usan uno amplio. */
// Se lee al cargar el módulo (los decoradores no tienen acceso a ConfigService); se valida en env.schema.
const CREDENTIALS_LIMIT = { default: { ttl: 60_000, limit: Number(process.env['AUTH_RATE_LIMIT'] ?? 10) || 10 } };
const SESSION_LIMIT = { default: { ttl: 60_000, limit: 120 } };

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService,
    private readonly account: AccountService,
  ) {}

  @Post('register')
  @Throttle(CREDENTIALS_LIMIT)
  async register(@Body({ schema: registerSchema }) body: RegisterInput, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.register(body);
    setDeviceCookie(res, await this.account.rememberDevice(user.id, req.cookies?.[DEVICE_COOKIE], req.headers['user-agent'], false));
    await this.account.sendVerification(user.id); // un fallo de correo no impide registrarse
    return this.issue(user.id, res);
  }

  @Post('login')
  @HttpCode(200)
  @Throttle(CREDENTIALS_LIMIT)
  async login(@Body({ schema: credentialsSchema }) body: Credentials, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.verifyCredentials(body.email, body.password);
    if (!user) throw new UnauthorizedException('Email o contraseña incorrectos');
    setDeviceCookie(res, await this.account.rememberDevice(user.id, req.cookies?.[DEVICE_COOKIE], req.headers['user-agent'], true));
    return this.issue(user.id, res);
  }

  @Post('refresh')
  @HttpCode(200)
  @Throttle(SESSION_LIMIT)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) throw new UnauthorizedException('Sesión vencida');
    try {
      const pair = await this.tokens.refresh(token);
      setRefreshCookie(res, pair.refreshToken, REFRESH_TTL_MS);
      return { accessToken: pair.accessToken, expiresIn: pair.expiresIn };
    } catch (error) {
      clearRefreshCookie(res);
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(204)
  @Throttle(SESSION_LIMIT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (token) await this.tokens.revoke(token);
    clearRefreshCookie(res);
  }

  private async issue(userId: string, res: Response) {
    const pair = await this.tokens.issue(userId, { method: 'password' });
    setRefreshCookie(res, pair.refreshToken, REFRESH_TTL_MS);
    return { accessToken: pair.accessToken, expiresIn: pair.expiresIn };
  }
}
