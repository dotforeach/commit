// Proxy del dev server: /api y los health checks van al backend.
// En Docker API_PROXY_TARGET=http://backend-dev:3000; en local, localhost.
const target = process.env.API_PROXY_TARGET ?? 'http://localhost:3000';

export default {
  '/api': { target, secure: false, changeOrigin: true },
  '/health': { target, secure: false },
  '/ready': { target, secure: false },
};
