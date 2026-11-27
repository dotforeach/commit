/**
 * Corre antes de importar cada archivo de test: cada worker de Vitest usa su propio prefijo de
 * colas, así un job encolado en un archivo no lo toma el worker de otra app de test en paralelo.
 */
process.env['QUEUE_PREFIX'] = `bull-test-${process.env['VITEST_POOL_ID'] ?? '0'}-${process.pid}`;
