import { NotFoundException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { Env } from '../config/env.schema.js';
import { StatusController } from './status.controller.js';
import type { StatusService } from './status.service.js';

const config = (env: Partial<Env>) => ({ get: (k: keyof Env) => env[k] }) as unknown as ConfigService<Env, true>;
const service = { snapshot: () => ({ generatedAt: 'x', nodes: [] }) } as unknown as StatusService;

describe('StatusController', () => {
  it('en desarrollo responde sin token', () => {
    expect(new StatusController(service, config({ NODE_ENV: 'development', STATUS_TOKEN: '' })).get(undefined)).toMatchObject({ nodes: [] });
  });

  it('en producción: 404 sin token, con token incorrecto o sin STATUS_TOKEN configurado', () => {
    const prod = new StatusController(service, config({ NODE_ENV: 'production', STATUS_TOKEN: 'secreto-de-operador' }));
    expect(() => prod.get(undefined)).toThrow(NotFoundException);
    expect(() => prod.get('otro')).toThrow(NotFoundException);
    expect(() => new StatusController(service, config({ NODE_ENV: 'production', STATUS_TOKEN: '' })).get('')).toThrow(NotFoundException);
  });

  it('en producción con el token correcto responde', () => {
    const prod = new StatusController(service, config({ NODE_ENV: 'production', STATUS_TOKEN: 'secreto-de-operador' }));
    expect(prod.get('secreto-de-operador')).toMatchObject({ nodes: [] });
  });
});
