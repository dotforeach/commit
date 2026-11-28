#!/usr/bin/env bash
# Despliega una versión en un ambiente: migraciones con la imagen nueva y después infraestructura y apps.
# (En el primer despliegue el job de migraciones todavía no existe: se crea y se ejecuta después.)
# Variables: RG, PARAMS, ACR_NAME, IMAGE_TAG y los secretos que lee el .bicepparam.
set -euo pipefail
: "${RG:?}" "${PARAMS:?}" "${ACR_NAME:?}" "${IMAGE_TAG:?}"
REGISTRY="$ACR_NAME.azurecr.io"
JOB="commit-${RG#rg-commit-}-migrate"   # rg-commit-prod → commit-prod-migrate

migrate() {
  echo "▶ Migraciones con $IMAGE_TAG"
  az containerapp job update -g "$RG" -n "$JOB" --image "$REGISTRY/commit-migrate:$IMAGE_TAG" -o none
  local exec status=""
  exec=$(az containerapp job start -g "$RG" -n "$JOB" --query name -o tsv)
  for _ in $(seq 1 60); do
    status=$(az containerapp job execution show -g "$RG" -n "$JOB" --job-execution-name "$exec" --query properties.status -o tsv)
    case "$status" in
      Succeeded) echo "  migraciones aplicadas"; return 0 ;;
      Failed|Stopped|Degraded) echo "✗ Las migraciones fallaron ($status). Logs: az containerapp job logs show -g $RG -n "$JOB" --execution $exec --container migrate"; exit 1 ;;
    esac
    sleep 10
  done
  echo "✗ Las migraciones no terminaron a tiempo ($status)"; exit 1
}

FIRST=true
az containerapp job show -g "$RG" -n "$JOB" -o none 2>/dev/null && FIRST=false
$FIRST || migrate

# Certificados ya emitidos para los dominios (los crea domains.sh la primera vez): se pasan al template
# para que el despliegue mantenga los dominios en vez de quitarlos.
ENV_NAME="${RG#rg-commit-}"
if [ "$ENV_NAME" = prod ]; then WEB_HOST=commit.atheneox.com; API_HOST=api-commit.atheneox.com
else WEB_HOST=staging-commit.atheneox.com; API_HOST=api-staging-commit.atheneox.com; fi
cert() { az containerapp env certificate list -g Noxi -n noxi-env --query "[?properties.subjectName=='$1'] | [0].id" -o tsv 2>/dev/null; }
export WEB_CERT_ID API_CERT_ID
WEB_CERT_ID=$(cert "$WEB_HOST"); API_CERT_ID=$(cert "$API_HOST")
echo "  dominios: $WEB_HOST ${WEB_CERT_ID:+(certificado ok)} · $API_HOST ${API_CERT_ID:+(certificado ok)}"

echo "▶ Infraestructura y apps ($RG, $IMAGE_TAG)"
# Un reintento: ARM a veces falla al leer un recurso recién creado (ResourceNotFound transitorio)
az deployment group create -g "$RG" -f infra/main.bicep -p "$PARAMS" --name "commit-${IMAGE_TAG:0:40}" -o none || {
  echo "  reintentando el despliegue en 30 s…"; sleep 30
  az deployment group create -g "$RG" -f infra/main.bicep -p "$PARAMS" --name "commit-${IMAGE_TAG:0:40}-r" -o none
}

$FIRST && migrate
echo "✔ Desplegado $IMAGE_TAG en $RG"
