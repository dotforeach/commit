#!/usr/bin/env bash
# Restaura un respaldo diario cifrado.
#   infra/scripts/restore.sh <fecha AAAA-MM-DD> <base> <archivo-clave-age> [DATABASE_URL destino]
# Sin DATABASE_URL, solo descarga y descifra a ./<base>-<fecha>.dump (para inspeccionar con pg_restore -l).
# Requiere tu sesión de Azure (az login) con permiso de lectura de blobs sobre la cuenta de respaldos.
set -euo pipefail
DAY="${1:?fecha}"; DB="${2:?base}"; KEY="${3:?clave age}"; TARGET="${4:-}"
ACCOUNT=$(az storage account list -g rg-commit-shared --query "[?starts_with(name,'commitbak')].name | [0]" -o tsv)
ENC="$DB-$DAY.dump.age"; OUT="$DB-$DAY.dump"
az storage blob download --auth-mode login --account-name "$ACCOUNT" -c pg-backups -n "daily/$DAY/$DB.dump.age" -f "$ENC" -o none
docker run --rm -v "$PWD:/w" -v "$(cd "$(dirname "$KEY")" && pwd)/$(basename "$KEY"):/key:ro" -w /w alpine:3 \
  sh -c "apk add -q age && age -d -i /key -o '$OUT' '$ENC'"
rm -f "$ENC"
echo "✔ Descifrado: $OUT"
if [ -n "$TARGET" ]; then
  docker run --rm -v "$PWD:/w" -w /w postgres:18-alpine pg_restore --no-owner --no-privileges --clean --if-exists -d "$TARGET" "$OUT"
  echo "✔ Restaurado en el destino"
fi
