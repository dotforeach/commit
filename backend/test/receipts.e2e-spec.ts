import { createHmac } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sodium from 'libsodium-wrappers';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { WhatsappClient } from '../src/receipts/whatsapp.client.js';
import { b64, buildRegistration, createTestApp } from './helpers.js';

/** Cliente de WhatsApp de prueba: no llama a Meta, registra lo que se habría enviado. */
class TestWhatsapp extends WhatsappClient {
  sent: { to: string; body: string }[] = [];
  override async sendText(to: string, body: string) {
    this.sent.push({ to, body });
  }
  override async downloadMedia() {
    return { data: Buffer.from('imagen falsa'), mimeType: 'image/jpeg' };
  }
}

const sign = (body: string) => `sha256=${createHmac('sha256', 'test-app-secret').update(body).digest('hex')}`;
const textMessage = (from: string, text: string) => ({ entry: [{ changes: [{ value: { messages: [{ from, type: 'text', text: { body: text } }] } }] }] });
const imageMessage = (from: string) => ({ entry: [{ changes: [{ value: { messages: [{ from, type: 'image', image: { id: 'media-1' } }] } }] }] });

const sample = {
  documentType: 'purchase',
  merchant: 'Súper 99',
  date: '2026-11-20',
  total: '23.40',
  currency: 'USD',
  tax: '1.53',
  paymentMethod: 'credit_card',
  cardLast4: '4321',
  category: 'groceries',
  items: [{ description: 'Leche', amount: '2.10' }],
  statement: null,
  confidence: 0.92,
  notes: null,
};

describe('Facturas por WhatsApp (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let wa: TestWhatsapp;
  const users: string[] = [];

  beforeAll(async () => {
    app = (await createTestApp((b) =>
      b.overrideProvider(WhatsappClient).useFactory({ factory: (c: ConfigService) => new TestWhatsapp(c as never), inject: [ConfigService] }),
    )) as INestApplication<App>;
    prisma = app.get(PrismaService);
    wa = app.get(WhatsappClient) as TestWhatsapp;
    await sodium.ready;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: users } } });
    await app.close();
  });

  async function register() {
    const box = sodium.crypto_box_keypair();
    const reg = buildRegistration();
    reg.keys.publicKey = b64(box.publicKey);
    const res = await request(app.getHttpServer()).post('/api/auth/register').send(reg).expect(201);
    users.push(reg.userId);
    // Vincular WhatsApp y suscribirse requieren el correo verificado
    await prisma.user.update({ where: { id: reg.userId }, data: { emailVerifiedAt: new Date() } });
    return { userId: reg.userId, auth: { Authorization: `Bearer ${res.body.accessToken}` }, box };
  }

  const webhook = (payload: unknown, signature?: string) => {
    const body = JSON.stringify(payload);
    return request(app.getHttpServer())
      .post('/api/webhooks/whatsapp')
      .set('content-type', 'application/json')
      .set('x-hub-signature-256', signature ?? sign(body))
      .send(body);
  };

  it('verificación del webhook con el token configurado', async () => {
    await request(app.getHttpServer()).get('/api/webhooks/whatsapp').query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'verify-me', 'hub.challenge': '42' }).expect(200, '42');
    await request(app.getHttpServer()).get('/api/webhooks/whatsapp').query({ 'hub.mode': 'subscribe', 'hub.verify_token': 'otro', 'hub.challenge': '42' }).expect(400);
  });

  it('rechaza mensajes sin la firma de Meta', async () => {
    await webhook(textMessage('50761111111', 'hola'), 'sha256=00').expect(400);
  });

  it('vincula el número con un código de un solo uso y guarda solo un hash', async () => {
    const u = await register();
    await request(app.getHttpServer()).post('/api/me/whatsapp/link-code').set(u.auth).send({ consent: false }).expect(400);
    const { body: code } = await request(app.getHttpServer()).post('/api/me/whatsapp/link-code').set(u.auth).send({ consent: true }).expect(201);
    expect(code.code).toMatch(/^COMMIT-\d{6}$/);
    expect(code.waLink).toContain('wa.me/50760000000');

    const phone = `5076${Math.floor(1_000_000 + Math.random() * 8_999_999)}`;
    await webhook(textMessage(phone, `Hola, mi código es ${code.code}`)).expect(200);
    expect(wa.sent.at(-1)).toMatchObject({ to: phone, body: expect.stringContaining('vinculado') });

    const link = await prisma.whatsappLink.findUnique({ where: { userId: u.userId } });
    expect(link?.phoneHash).toMatch(/^[0-9a-f]{64}$/);
    expect(link?.phoneHash).not.toContain(phone);

    // El código no se puede reutilizar
    await webhook(textMessage('50769999999', code.code)).expect(200);
    expect(await prisma.whatsappLink.count({ where: { userId: u.userId } })).toBe(1);

    const { body: status } = await request(app.getHttpServer()).get('/api/me/whatsapp').set(u.auth).expect(200);
    expect(status).toMatchObject({ linked: true, whatsappConfigured: true, number: '50760000000' });

    // Una foto de un número vinculado se encola y, sin IA configurada, falla con un aviso amable
    await webhook(imageMessage(phone)).expect(200);
    await expect.poll(() => wa.sent.filter((s) => s.to === phone).map((s) => s.body).join('\n'), { timeout: 10_000 }).toContain('No pude leer');
    expect(await prisma.receiptEvent.count({ where: { userId: u.userId, status: 'FAILED' } })).toBe(1);

    await request(app.getHttpServer()).delete('/api/me/whatsapp').set(u.auth).expect(204);
    await webhook(imageMessage(phone)).expect(200);
    expect(wa.sent.at(-1)!.body).toContain('no está vinculado');
  }, 20_000);

  it('la bandeja guarda el resultado SELLADO: solo la clave privada del usuario lo abre', async () => {
    const u = await register();
    await request(app.getHttpServer()).post('/api/me/receipts/dev-sample').set(u.auth).send(sample).expect(204);
    const row = await prisma.receiptInboxItem.findFirstOrThrow({ where: { userId: u.userId } });
    expect(Buffer.from(row.sealed).toString('utf8')).not.toContain('Súper 99');

    const { body } = await request(app.getHttpServer()).get('/api/me/receipts').set(u.auth).expect(200);
    expect(body.items).toHaveLength(1);
    const opened = sodium.crypto_box_seal_open(Buffer.from(body.items[0].sealed, 'base64'), u.box.publicKey, u.box.privateKey);
    expect(JSON.parse(new TextDecoder().decode(opened)).extraction).toMatchObject({ merchant: 'Súper 99', total: '23.40' });

    // Otra persona no ve ni borra la bandeja ajena
    const other = await register();
    expect((await request(app.getHttpServer()).get('/api/me/receipts').set(other.auth).expect(200)).body.items).toHaveLength(0);
    await request(app.getHttpServer()).delete(`/api/me/receipts/${body.items[0].id}`).set(other.auth).expect(404);
    await request(app.getHttpServer()).delete(`/api/me/receipts/${body.items[0].id}`).set(u.auth).expect(204);
  });

  it('suscripción: planes de $2 y $20, activación de prueba en desarrollo', async () => {
    const u = await register();
    const { body } = await request(app.getHttpServer()).get('/api/me/subscription').set(u.auth).expect(200);
    expect(body).toMatchObject({ subscription: null, plans: { MONTHLY: { price: 2 }, YEARLY: { price: 20 } } });
    await request(app.getHttpServer()).post('/api/me/subscription/checkout').set(u.auth).send({ plan: 'MONTHLY' }).expect(400);
    const { body: sub } = await request(app.getHttpServer()).post('/api/me/subscription/dev-activate').set(u.auth).send({ plan: 'YEARLY' }).expect(201);
    expect(sub).toMatchObject({ plan: 'YEARLY', status: 'ACTIVE' });
  });

  it('extrae los mensajes del payload de Meta', async () => {
    const { extractMessages } = await import('../src/receipts/receipts.controller.js');
    expect(extractMessages({ entry: [{ changes: [{ value: { statuses: [{}] } }] }] })).toEqual([]);
    expect(extractMessages(imageMessage('507'))).toEqual([{ from: '507', type: 'image', mediaId: 'media-1' }]);
  });
});
