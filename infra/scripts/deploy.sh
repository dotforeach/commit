#!/usr/bin/env bash
# Despliega una versión en un ambiente: migraciones con la imagen nueva y después infraestructura y apps.
# (En el primer despliegue el job de migraciones todavía no existe: se crea y se ejecuta después.)
# Variables: RG, PARAMS, ACR_NAME, IMAGE_TAG y los secretos que lee el .bicepparam.
set -euo pipefail
: "${RG:?}" "${PARAMS:?}" "${ACR_NAME:?}" "${IMAGE_TAG:?}"
REGISTRY="$ACR_NAME.azurecr.io"

migrate() {
  echo "▶ Migraciones con $IMAGE_TAG"
  az containerapp job update -g "$RG" -n commit-migrate --image "$REGISTRY/commit-migrate:$IMAGE_TAG" -o none
  local exec status=""
  exec=$(az containerapp job start -g "$RG" -n commit-migrate --query name -o tsv)
  for _ in $(seq 1 60); do
    status=$(az containerapp job execution show -g "$RG" -n commit-migrate --job-execution-name "$exec" --query properties.status -o tsv)
    case "$status" in
      Succeeded) echo "  migraciones aplicadas"; return 0 ;;
      Failed|Stopped|Degraded) echo "✗ Las migraciones fallaron ($status). Logs: az containerapp job logs show -g $RG -n commit-migrate --execution $exec --container migrate"; exit 1 ;;
    esac
    sleep 10
  done
  echo "✗ Las migraciones no terminaron a tiempo ($status)"; exit 1
}

FIRST=true
az containerapp job show -g "$RG" -n commit-migrate -o none 2>/dev/null && FIRST=false
$FIRST || migrate

echo "▶ Infraestructura y apps ($RG, $IMAGE_TAG)"
az deployment group create -g "$RG" -f infra/main.bicep -p "$PARAMS" --name "commit-${IMAGE_TAG:0:40}" -o none

$FIRST && migrate
echo "✔ Desplegado $IMAGE_TAG en $RG"
