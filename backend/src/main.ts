import { ConsoleLogger, StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import type { Env } from './config/env.schema.js';

const isProduction = process.env.NODE_ENV === 'production';

const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  logger: new ConsoleLogger({
    json: isProduction,
    logLevels: isProduction ? ['log', 'warn', 'error', 'fatal'] : ['log', 'warn', 'error', 'fatal', 'debug'],
    redact: ['password', 'passwordHash', 'authorization', 'refreshToken', 'payload', 'encryptedPrivateKeys'],
  }),
});

const config = app.get<ConfigService<Env, true>>(ConfigService);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cookieParser());
app.useGlobalPipes(new StandardSchemaValidationPipe());
app.setGlobalPrefix('api', { exclude: ['health', 'ready'] });
app.enableCors({ origin: config.get('CORS_ORIGINS', { infer: true }), credentials: true });
app.enableShutdownHooks();

if (!isProduction) {
  const document = () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Finanzas 0→100 API').setVersion('0.1').addBearerAuth().build(),
    );
  SwaggerModule.setup('api/docs', app, document);
}

await app.listen(config.get('PORT', { infer: true }), '0.0.0.0');
