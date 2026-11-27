#!/usr/bin/env bash
# Prueba de humo después de desplegar:
#  1) la app web carga, 2) el backend está listo, 3) nginx enruta /api al backend (sin sesión: 401).
set -euo pipefail
WEB="${1:?url web}"; API="${2:?url api}"
code() { curl -s -o /dev/null -w '%{http_code}' "$1" || true; }
for _ in $(seq 1 30); do
  if [ "$(code "$WEB/")" = 200 ] && [ "$(code "$API/ready")" = 200 ] && [ "$(code "$WEB/api/currencies")" = 401 ]; then
    echo "✔ $WEB carga, $API está listo y /api llega al backend"; exit 0
  fi
  sleep 10
done
echo "✗ Prueba de humo: web=$(code "$WEB/") api=$(code "$API/ready") proxy=$(code "$WEB/api/currencies")"; exit 1
