/**
 * Genera openapi.json sin conectarse a la base ni a Redis (modo preview: no instancia proveedores).
 * Uso: pnpm openapi  →  ../frontend/src/app/core/api/openapi.json (se ejecuta desde dist/ tras compilar)
 */
import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

const app = await NestFactory.create(AppModule, { preview: true, logger: false });
app.setGlobalPrefix('api', { exclude: ['health', 'ready'] });
const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Finanzas 0→100 API').setVersion('0.1').addBearerAuth().build());
const out = new URL('../frontend/src/app/core/api/openapi.json', `file://${process.cwd()}/`);
writeFileSync(out, JSON.stringify(document, null, 2) + '\n');
console.log(`OpenAPI: ${Object.keys(document.paths).length} rutas → ${out.pathname}`);
await app.close();
