import type { INestApplication } from '@nestjs/common';
import { InMemoryMailTransport, MailTransport } from '@nestjs/mail';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { buildRegistration, createTestApp } from './helpers.js';

const cookieOf = (res: request.Response, name: string) =>
  ([] as string[]).concat(res.headers['set-cookie'] ?? []).find((c) => c.startsWith(`${name}=`))?.split(';')[0];

describe('Cuenta: correo, contraseña, sesiones y eliminación (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const mailbox = new InMemoryMailTransport();
  const users: string[] = [];

  beforeAll(async () => {
    app = (await createTestApp((b) => b.overrideProvider(MailTransport).useValue(mailbox))) as INestApplication<App>;
    prisma = app.get(PrismaService);
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    await app.close();
  });

  const http = () => request(app.getHttpServer());
  async function register() {
    const reg = buildRegistration();
    const res = await http().post('/api/auth/register').send(reg).expect(201);
    users.push(reg.userId);
    return { reg, auth: { Authorization: `Bearer ${res.body.accessToken}` }, refresh: cookieOf(res, 'rt')!, device: cookieOf(res, 'did')! };
  }
  const tokenFrom = (to: string, subject: RegExp) => mailbox.assertSent({ to, subject }).link(/token=/).searchParams.get('token')!;

  it('verificación de correo: enlace de un solo uso y bienvenida', async () => {
    const u = await register();
    const token = tokenFrom(u.reg.email, /Confirma tu correo/);
    expect((await http().get('/api/me').set(u.auth).expect(200)).body.user.emailVerifiedAt).toBeNull();

    await http().post('/api/auth/verify-email').send({ token }).expect(204);
    expect((await http().get('/api/me').set(u.auth).expect(200)).body.user.emailVerifiedAt).not.toBeNull();
    mailbox.assertSent({ to: u.reg.email, subject: /Bienvenido/ });
    await http().post('/api/auth/verify-email').send({ token }).expect(400); // ya usado

    // Ya verificado: reenviar no envía nada
    expect((await http().post('/api/me/email/verification').set(u.auth).expect(201)).body).toEqual({ alreadyVerified: true });
  });

  it('funciones de pago requieren correo verificado (WhatsApp)', async () => {
    const u = await register();
    const res = await http().post('/api/me/whatsapp/link-code').set(u.auth).send({ consent: true }).expect(403);
    expect(res.body.errorCode).toBe('email_not_verified');
  });

  it('olvidé mi contraseña: no revela si el correo existe; restablece y cierra sesiones', async () => {
    const before = mailbox.mails.length;
    await http().post('/api/auth/forgot-password').send({ email: 'nadie-registrado@example.com' }).expect(204);
    expect(mailbox.mails.length).toBe(before);

    const u = await register();
    await http().post('/api/auth/forgot-password').send({ email: u.reg.email }).expect(204);
    const token = tokenFrom(u.reg.email, /Restablece tu contraseña/);
    await http().post('/api/auth/reset-password').send({ token, password: 'contraseña-nueva-segura' }).expect(204);
    await http().post('/api/auth/reset-password').send({ token, password: 'otra-contraseña-segura' }).expect(400);

    await http().post('/api/auth/login').send({ email: u.reg.email, password: u.reg.password }).expect(401);
    await http().post('/api/auth/login').send({ email: u.reg.email, password: 'contraseña-nueva-segura' }).set('Cookie', u.device).expect(200);
    await http().post('/api/auth/refresh').set('Cookie', u.refresh).expect(401); // la sesión anterior se cerró
    mailbox.assertSent({ to: u.reg.email, subject: /Tu contraseña de Commit cambió/ });
  });

  it('cambiar la contraseña exige la actual y deja este dispositivo con sesión', async () => {
    const u = await register();
    await http().put('/api/me/password').set(u.auth).send({ currentPassword: 'incorrecta', newPassword: 'otra-contraseña-larga' }).expect(401);
    const res = await http().put('/api/me/password').set(u.auth).send({ currentPassword: u.reg.password, newPassword: 'otra-contraseña-larga' }).expect(200);
    expect(res.body.accessToken).toBeTruthy();
    await http().post('/api/auth/refresh').set('Cookie', cookieOf(res, 'rt')!).expect(200);
    await http().post('/api/auth/refresh').set('Cookie', u.refresh).expect(401);
  });

  it('cambiar el correo: confirma en el nuevo y avisa al anterior', async () => {
    const u = await register();
    const nuevo = `nuevo-${Date.now()}@example.com`;
    await http().post('/api/me/email').set(u.auth).send({ password: u.reg.password, newEmail: nuevo }).expect(204);
    mailbox.assertSent({ to: u.reg.email, subject: /Pidieron cambiar el correo/ });
    const token = tokenFrom(nuevo, /Confirma tu nuevo correo/);
    await http().post('/api/auth/confirm-email').send({ token }).expect(204);
    await http().post('/api/auth/login').send({ email: nuevo, password: u.reg.password }).set('Cookie', u.device).expect(200);
  });

  it('aviso de ingreso desde un dispositivo nuevo (y no desde uno conocido)', async () => {
    const u = await register();
    await http().post('/api/auth/login').send({ email: u.reg.email, password: u.reg.password }).set('Cookie', u.device).expect(200);
    expect(mailbox.find({ to: u.reg.email, subject: /Nuevo ingreso/ })).toBeUndefined();
    await http().post('/api/auth/login').send({ email: u.reg.email, password: u.reg.password }).set('User-Agent', 'Mozilla/5.0 (iPhone) Safari/605.1').expect(200);
    expect(mailbox.assertSent({ to: u.reg.email, subject: /Nuevo ingreso/ }).text).toContain('Safari en iOS');
  });

  it('cerrar sesión en todos los dispositivos', async () => {
    const u = await register();
    await http().post('/api/me/sessions/revoke-all').set(u.auth).expect(204);
    await http().post('/api/auth/refresh').set('Cookie', u.refresh).expect(401);
  });

  it('eliminar la cuenta: exige contraseña y la palabra ELIMINAR; borra todo lo personal', async () => {
    const u = await register();
    await http().delete('/api/me').set(u.auth).send({ password: u.reg.password, confirm: 'si' }).expect(400);
    await http().delete('/api/me').set(u.auth).send({ password: 'incorrecta', confirm: 'ELIMINAR' }).expect(401);
    await http().delete('/api/me').set(u.auth).send({ password: u.reg.password, confirm: 'ELIMINAR' }).expect(204);
    expect(await prisma.user.findUnique({ where: { id: u.reg.userId } })).toBeNull();
    expect(await prisma.household.findUnique({ where: { id: u.reg.household.id } })).toBeNull();
    mailbox.assertSent({ to: u.reg.email, subject: /fue eliminada/ });
  });
});
