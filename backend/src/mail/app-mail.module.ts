import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogMailTransport, MailModule, MailTransport, SmtpTransport, type MailMessage, type MailTransportResult } from '@nestjs/mail';
import type { Env } from '../config/env.schema.js';
import { AppMailer } from './app-mailer.js';

/** En producción sin SMTP: no envía y lo avisa en el log (sin el cuerpo, que puede tener enlaces). */
class DisabledMailTransport extends MailTransport {
  private readonly logger = new Logger('Mail');
  send(message: MailMessage): Promise<MailTransportResult> {
    this.logger.warn(`Correo NO enviado (falta SMTP_URL): «${message.subject}»`);
    return Promise.resolve({ accepted: [] });
  }
}

@Module({
  imports: [
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const url = config.get('SMTP_URL', { infer: true });
        const production = config.get('NODE_ENV', { infer: true }) === 'production';
        const transport = url
          ? new SmtpTransport({ url, startTls: config.get('SMTP_STARTTLS', { infer: true }), pool: true })
          : production
            ? new DisabledMailTransport()
            : new LogMailTransport();
        return { transport, from: config.get('MAIL_FROM', { infer: true }), retry: 3 };
      },
    }),
  ],
  providers: [AppMailer],
  exports: [AppMailer],
})
export class AppMailModule {}
