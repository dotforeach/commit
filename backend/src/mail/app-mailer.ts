import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { html, Mailer, type SafeHtml } from '@nestjs/mail';
import type { Env } from '../config/env.schema.js';

/**
 * Correos de la cuenta, con la marca de Commit. Nunca incluyen datos financieros
 * (el servidor no los conoce). Todo valor interpolado con `html` se escapa.
 */
export interface Recipient {
  email: string;
  displayName: string;
}

const BRAND = '#005cbb';

@Injectable()
export class AppMailer {
  private readonly logger = new Logger(AppMailer.name);
  private readonly appUrl: string;

  constructor(
    private readonly mailer: Mailer,
    config: ConfigService<Env, true>,
  ) {
    this.appUrl = config.get('APP_URL', { infer: true }).replace(/\/$/, '');
  }

  link(path: string, params: Record<string, string> = {}) {
    const url = new URL(path, `${this.appUrl}/`);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url.toString();
  }

  // ── Plantillas ──────────────────────────────────────────────────────────────
  verifyEmail(to: Recipient, token: string) {
    const url = this.link('verificar-correo', { token });
    return this.send(to, 'Confirma tu correo en Commit', {
      title: `¡Hola, ${to.displayName}!`,
      lines: ['Confirma tu correo para proteger tu cuenta: lo usaremos para que puedas recuperar tu contraseña y avisarte de cambios importantes.'],
      action: { label: 'Confirmar mi correo', url },
      footnote: 'El enlace vence en 24 horas. Si no creaste una cuenta en Commit, ignora este mensaje.',
    });
  }

  welcome(to: Recipient) {
    return this.send(to, 'Bienvenido a Commit 🐷', {
      title: `¡Bienvenido, ${to.displayName}!`,
      lines: [
        'Tu correo quedó confirmado. Estos son buenos primeros pasos:',
        '• Carga tu sueldo y tus gastos fijos en «Primeros pasos»: en 5 minutos tienes un presupuesto sugerido.',
        '• Mira tu «Plan mágico»: te dice qué pagar primero y cuánto ahorrar cada mes.',
        '• Guarda tu frase de recuperación de 24 palabras en un lugar seguro. Es la única forma de recuperar tus datos si olvidas tu clave de descifrado: nosotros no podemos hacerlo por ti.',
      ],
      action: { label: 'Ir a Commit', url: this.link('inicio') },
    });
  }

  resetPassword(to: Recipient, token: string) {
    const url = this.link('restablecer-contrasena', { token });
    return this.send(to, 'Restablece tu contraseña de Commit', {
      title: 'Restablece tu contraseña',
      lines: [
        'Recibimos una solicitud para cambiar la contraseña de ingreso de tu cuenta.',
        'Esto no cambia tu clave de descifrado ni afecta tus datos: siguen cifrados con tu clave.',
      ],
      action: { label: 'Elegir una contraseña nueva', url },
      footnote: 'El enlace vence en 1 hora y sirve una sola vez. Si no fuiste tú, ignora este mensaje: tu contraseña no cambia.',
    });
  }

  passwordChanged(to: Recipient) {
    return this.send(to, 'Tu contraseña de Commit cambió', {
      title: 'Tu contraseña cambió',
      lines: ['La contraseña de ingreso de tu cuenta se cambió y cerramos las sesiones en tus otros dispositivos.'],
      footnote: 'Si no fuiste tú, restablece tu contraseña desde «¿Olvidaste tu contraseña?» en la pantalla de ingreso.',
    });
  }

  passphraseChanged(to: Recipient) {
    return this.send(to, 'Tu clave de descifrado cambió', {
      title: 'Tu clave de descifrado cambió',
      lines: ['La clave de descifrado de tu cuenta se cambió. Desde ahora, tus datos se abren con la clave nueva.'],
      footnote: 'Si no fuiste tú, cambia tu contraseña de ingreso y tu clave de descifrado cuanto antes.',
    });
  }

  confirmEmailChange(to: Recipient, newEmail: string, token: string) {
    const url = this.link('confirmar-correo', { token });
    return this.send({ ...to, email: newEmail }, 'Confirma tu nuevo correo en Commit', {
      title: 'Confirma tu nuevo correo',
      lines: [`Pediste usar ${newEmail} para tu cuenta de Commit.`],
      action: { label: 'Confirmar este correo', url },
      footnote: 'El enlace vence en 24 horas. Si no lo pediste, ignora este mensaje.',
    });
  }

  emailChangeRequested(to: Recipient, newEmail: string) {
    return this.send(to, 'Pidieron cambiar el correo de tu cuenta', {
      title: 'Cambio de correo solicitado',
      lines: [`Se pidió cambiar el correo de tu cuenta de Commit a ${newEmail}. El cambio se aplica cuando se confirme desde ese correo.`],
      footnote: 'Si no fuiste tú, cambia tu contraseña de ingreso y cierra la sesión en todos tus dispositivos desde Ajustes.',
    });
  }

  newLogin(to: Recipient, device: string, when: Date) {
    return this.send(to, 'Nuevo ingreso a tu cuenta de Commit', {
      title: 'Nuevo ingreso a tu cuenta',
      lines: [
        `Alguien ingresó a tu cuenta desde un dispositivo nuevo: ${device}.`,
        `Fecha: ${when.toLocaleString('es-PA', { timeZone: 'America/Panama', dateStyle: 'long', timeStyle: 'short' })} (hora de Panamá).`,
        'Recuerda que, aun con tu contraseña, para ver tus datos hace falta tu clave de descifrado.',
      ],
      footnote: 'Si fuiste tú, no hace falta hacer nada. Si no, cambia tu contraseña y cierra la sesión en todos tus dispositivos desde Ajustes.',
    });
  }

  accountDeleted(to: Recipient) {
    return this.send(to, 'Tu cuenta de Commit fue eliminada', {
      title: 'Tu cuenta fue eliminada',
      lines: ['Eliminamos tu cuenta y tus datos personales. Gracias por haber usado Commit.'],
      footnote: 'Si no fuiste tú, responde a este correo de inmediato.',
    });
  }

  // ── Envío ───────────────────────────────────────────────────────────────────
  /** Envía sin interrumpir el flujo que lo origina: un fallo de correo se registra y no rompe el pedido. */
  private async send(
    to: Recipient,
    subject: string,
    c: { title: string; lines: string[]; action?: { label: string; url: string }; footnote?: string },
  ): Promise<boolean> {
    const body: SafeHtml = html`<!doctype html>
<html lang="es"><body style="margin:0;background:#f3f4f9;font-family:Roboto,Arial,sans-serif;color:#1b1b1f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;padding:28px">
<tr><td style="font-size:20px;font-weight:500;padding-bottom:16px">🐷 Commit</td></tr>
<tr><td style="font-size:22px;font-weight:500;padding-bottom:12px">${c.title}</td></tr>
${c.lines.map((l) => html`<tr><td style="font-size:15px;line-height:1.6;padding-bottom:10px">${l}</td></tr>`)}
${c.action ? html`<tr><td style="padding:16px 0"><a href="${c.action.url}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:500">${c.action.label}</a></td></tr>
<tr><td style="font-size:12px;color:#5d5e66;word-break:break-all">Si el botón no funciona, copia este enlace: ${c.action.url}</td></tr>` : html``}
${c.footnote ? html`<tr><td style="font-size:13px;color:#5d5e66;padding-top:16px">${c.footnote}</td></tr>` : html``}
<tr><td style="font-size:12px;color:#8b8c94;padding-top:24px">Commit · Finanzas personales, gratis y privadas. Este correo no contiene datos financieros.</td></tr>
</table></td></tr></table></body></html>`;
    const text = [c.title, '', ...c.lines, ...(c.action ? ['', `${c.action.label}: ${c.action.url}`] : []), ...(c.footnote ? ['', c.footnote] : []), '', '— Commit'].join('\n');
    try {
      await this.mailer.send({ to: { name: to.displayName, address: to.email }, subject, html: body, text });
      return true;
    } catch (e) {
      this.logger.warn(`No se pudo enviar «${subject}»: ${(e as Error).message}`);
      return false;
    }
  }
}
