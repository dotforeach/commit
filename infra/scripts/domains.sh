#!/usr/bin/env bash
# Dominios propios con certificado administrado (gratis) por Azure.
# Paso 1: muestra los registros DNS a crear. Paso 2 (--bind): los vincula cuando el DNS ya propagó.
set -euo pipefail
ENV="${1:?staging|prod}"; MODE="${2:-}"
RG="rg-commit-$ENV"
if [ "$ENV" = "prod" ]; then WEB=commit.atheneox.com; API=api-commit.atheneox.com; else WEB=staging-commit.atheneox.com; API=api-staging-commit.atheneox.com; fi
CAE=$(az containerapp env list -g "$RG" --query '[0].name' -o tsv)
VERIFY=$(az containerapp env show -g "$RG" -n "$CAE" --query properties.customDomainConfiguration.customDomainVerificationId -o tsv)
WEB_FQDN=$(az containerapp show -g "$RG" -n commit-web --query properties.configuration.ingress.fqdn -o tsv)
API_FQDN=$(az containerapp show -g "$RG" -n commit-api --query properties.configuration.ingress.fqdn -o tsv)

if [ "$MODE" != "--bind" ]; then
  cat <<DNS
Crea estos registros en el DNS de atheneox.com:
  CNAME  ${WEB%.atheneox.com}          →  $WEB_FQDN
  TXT    asuid.${WEB%.atheneox.com}    →  $VERIFY
  CNAME  ${API%.atheneox.com}          →  $API_FQDN
  TXT    asuid.${API%.atheneox.com}    →  $VERIFY
Cuando propaguen: infra/scripts/domains.sh $ENV --bind
DNS
  exit 0
fi

for pair in "commit-web:$WEB" "commit-api:$API"; do
  APP="${pair%%:*}"; HOST="${pair#*:}"
  az containerapp hostname add -g "$RG" -n "$APP" --hostname "$HOST" -o none 2>/dev/null || true
  az containerapp hostname bind -g "$RG" -n "$APP" --hostname "$HOST" --environment "$CAE" --validation-method CNAME -o none
  echo "✔ https://$HOST"
done
