import { Body, Controller, Delete, HttpCode, Post, Put, Req, Res } from '@nestjs/common';
import { CurrentUser, Public, TokenService } from '@nestjs/authentication';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  forgotSchema,
  resetSchema,
  tokenSchema,
  type ChangeEmailInput,
  type ChangePasswordInput,
  type DeleteAccountInput,
  type ForgotInput,
  type ResetInput,
  type TokenInput,
} from './account.schemas.js';
import { AccountService } from './account.service.js';
import { clearDeviceCookie, clearRefreshCookie, setRefreshCookie } from './refresh-cookie.js';

const REFRESH_TTL_MS = 30 * 24 * 3600 * 1000;
const STRICT = { default: { ttl: 60_000, limit: Number(process.env['AUTH_RATE_LIMIT'] ?? 10) || 10 } };
const RESEND = { default: { ttl: 600_000, limit: 3 } };

/** Enlaces que llegan por correo: no requieren sesión. */
@Public()
@Controller('auth')
export class AccountPublicController {
  constructor(private readonly account: AccountService) {}

  @Post('verify-email')
  @HttpCode(204)
  @Throttle(STRICT)
  async verifyEmail(@Body({ schema: tokenSchema }) body: TokenInput) {
    await this.account.verifyEmail(body.token);
  }

  /** Siempre 204, exista o no la cuenta. */
  @Post('forgot-password')
  @HttpCode(204)
  @Throttle(STRICT)
  async forgot(@Body({ schema: forgotSchema }) body: ForgotInput) {
    await this.account.forgotPassword(body.email);
  }

  @Post('reset-password')
  @HttpCode(204)
  @Throttle(STRICT)
  async reset(@Body({ schema: resetSchema }) body: ResetInput) {
    await this.account.resetPassword(body.token, body.password);
  }

  @Post('confirm-email')
  @HttpCode(204)
  @Throttle(STRICT)
  async confirmEmail(@Body({ schema: tokenSchema }) body: TokenInput) {
    await this.account.confirmEmailChange(body.token);
  }
}

/** Seguridad de la cuenta, con sesión iniciada. */
@Controller('me')
export class AccountController {
  constructor(
    private readonly account: AccountService,
    private readonly tokens: TokenService,
  ) {}

  @Post('email/verification')
  @Throttle(RESEND)
  resend(@CurrentUser('id') userId: string) {
    return this.account.sendVerification(userId);
  }

  /** Cambia la contraseña, cierra todas las sesiones y abre una nueva para este dispositivo. */
  @Put('password')
  @Throttle(STRICT)
  async changePassword(@CurrentUser('id') userId: string, @Body({ schema: changePasswordSchema }) body: ChangePasswordInput, @Res({ passthrough: true }) res: Response) {
    await this.account.changePassword(userId, body.currentPassword, body.newPassword);
    const pair = await this.tokens.issue(userId, { method: 'password' });
    setRefreshCookie(res, pair.refreshToken, REFRESH_TTL_MS);
    return { accessToken: pair.accessToken, expiresIn: pair.expiresIn };
  }

  @Post('email')
  @HttpCode(204)
  @Throttle(STRICT)
  async changeEmail(@CurrentUser('id') userId: string, @Body({ schema: changeEmailSchema }) body: ChangeEmailInput) {
    await this.account.requestEmailChange(userId, body.password, body.newEmail);
  }

  @Post('sessions/revoke-all')
  @HttpCode(204)
  async revokeAll(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.account.revokeAll(userId);
    clearRefreshCookie(res);
  }

  @Delete()
  @HttpCode(204)
  @Throttle(STRICT)
  async deleteAccount(@CurrentUser('id') userId: string, @Body({ schema: deleteAccountSchema }) body: DeleteAccountInput, @Req() _req: Request, @Res({ passthrough: true }) res: Response) {
    await this.account.deleteAccount(userId, body.password);
    clearRefreshCookie(res);
    clearDeviceCookie(res);
  }
}
