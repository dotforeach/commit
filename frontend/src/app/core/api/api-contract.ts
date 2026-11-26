import type { paths } from './openapi';

/**
 * Tipos generados desde el OpenAPI del backend (`pnpm openapi` en backend → `pnpm api:types` acá).
 * Si un pedido del frontend no coincide con lo que valida la API, falla la compilación.
 */
type Method = 'get' | 'post' | 'put' | 'delete';

export type RequestBody<P extends keyof paths, M extends Method> = paths[P][M] extends {
  requestBody?: { content: { 'application/json': infer B } };
}
  ? B
  : never;
