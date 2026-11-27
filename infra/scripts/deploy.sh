#!/usr/bin/env bash
# Despliega una versión: 1) migraciones con la imagen nueva, 2) infraestructura y apps.
# Variables: RG, PARAMS, ACR_NAME, IMAGE_TAG y los secretos que lee el .bicepparam.
set -euo pipefail
: "${RG:?}" "${PARAMS:?}" "${ACR_NAME:?}" "${IMAGE_TAG:?}"
REGISTRY="$ACR_NAME.azurecr.io"

if az containerapp job show -g "$RG" -n commit-migrate >/dev/null 2>&1; then
  echo "▶ Migraciones con $IMAGE_TAG"
  az containerapp job update -g "$RG" -n commit-migrate --image "$REGISTRY/commit-migrate:$IMAGE_TAG" -o none
  EXEC=$(az containerapp job start -g "$RG" -n commit-migrate --query name -o tsv)
  for _ in $(seq 1 60); do
    STATUS=$(az containerapp job execution show -g "$RG" -n commit-migrate --job-execution-name "$EXEC" --query properties.status -o tsv)
    case "$STATUS" in
      Succeeded) echo "  migraciones aplicadas"; break ;;
      Failed|Stopped|Degraded) echo "✗ Las migraciones fallaron ($STATUS)"; exit 1 ;;
    esac
    sleep 10
  done
  [ "$STATUS" = "Succeeded" ] || { echo "✗ Las migraciones no terminaron a tiempo"; exit 1; }
fi

echo "▶ Infraestructura y apps ($RG, $IMAGE_TAG)"
az deployment group create -g "$RG" -f infra/main.bicep -p "$PARAMS" --name "commit-$IMAGE_TAG" -o none
echo "✔ Desplegado $IMAGE_TAG en $RG"
