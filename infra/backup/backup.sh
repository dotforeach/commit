#!/bin/sh
# Respalda cada base de $DATABASES, la cifra con la clave pública $AGE_RECIPIENT y la sube a
# https://$STORAGE_ACCOUNT.blob.core.windows.net/$CONTAINER/daily/<fecha>/<base>.dump.age
# (el día 1 de cada mes, también a monthly/). Se autentica con la identidad administrada de
# Container Apps: no usa claves de almacenamiento. La retención la aplica Blob Storage.
# Variables: PGHOST PGUSER PGPASSWORD PGSSLMODE DATABASES AGE_RECIPIENT STORAGE_ACCOUNT CONTAINER AZURE_CLIENT_ID
set -eu
: "${DATABASES:?}" "${AGE_RECIPIENT:?}" "${STORAGE_ACCOUNT:?}" "${CONTAINER:?}"
case "$AGE_RECIPIENT" in age1*) ;; *) echo "AGE_RECIPIENT no es una clave pública age"; exit 1 ;; esac

DAY=$(date -u +%Y-%m-%d)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

token() {
  if [ -n "${IDENTITY_ENDPOINT:-}" ]; then
    curl -sf -H "X-IDENTITY-HEADER: $IDENTITY_HEADER" \
      "$IDENTITY_ENDPOINT?resource=https://storage.azure.com/&api-version=2019-08-01&client_id=$AZURE_CLIENT_ID" | jq -r .access_token
  else
    echo "Sin identidad administrada (IDENTITY_ENDPOINT)" >&2; exit 1
  fi
}

upload() { # archivo ruta-en-el-contenedor
  code=$(curl -s -o "$WORK/resp" -w '%{http_code}' -X PUT --data-binary "@$1" \
    -H "Authorization: Bearer $TOKEN" -H "x-ms-version: 2023-11-03" -H "x-ms-blob-type: BlockBlob" \
    -H "x-ms-access-tier: Cool" -H "Content-Type: application/octet-stream" \
    "https://$STORAGE_ACCOUNT.blob.core.windows.net/$CONTAINER/$2")
  [ "$code" = 201 ] || { echo "✗ Subida de $2 falló ($code): $(head -c 300 "$WORK/resp")"; exit 1; }
}

TOKEN=$(token)
for DB in $DATABASES; do
  OUT="$WORK/$DB.dump.age"
  # -Fc ya comprime; age cifra en flujo (nunca queda el respaldo sin cifrar en disco)
  pg_dump -Fc --no-owner --no-privileges -d "$DB" | age -r "$AGE_RECIPIENT" -o "$OUT"
  SIZE=$(wc -c < "$OUT")
  [ "$SIZE" -gt 100 ] || { echo "✗ Respaldo de $DB vacío"; exit 1; }
  upload "$OUT" "daily/$DAY/$DB.dump.age"
  [ "$(date -u +%d)" = 01 ] && upload "$OUT" "monthly/$(date -u +%Y-%m)/$DB.dump.age"
  echo "✔ $DB: $SIZE bytes → daily/$DAY/$DB.dump.age"
done
