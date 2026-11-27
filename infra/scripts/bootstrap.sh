#!/usr/bin/env bash
# Preparación inicial (una sola vez), con tu sesión de Azure (`az login`):
#  - grupos de recursos (shared, staging, prod) y registro de imágenes
#  - aplicación de Entra para GitHub Actions con OIDC (sin contraseñas) y permisos mínimos
#  - secretos generados para cada ambiente en infra/.secrets.<env>.env (no se versionan)
#  - primeras imágenes (compiladas en Azure) y primer despliegue de staging y prod
set -euo pipefail
LOCATION="${LOCATION:-northcentralus}"
REPO="${REPO:-dotforeach/commit}"
cd "$(dirname "$0")/../.."

SUB=$(az account show --query id -o tsv); TENANT=$(az account show --query tenantId -o tsv)
echo "Suscripción: $(az account show --query name -o tsv) ($SUB)"

for rg in rg-commit-shared rg-commit-staging rg-commit-prod; do
  az group create -n "$rg" -l "$LOCATION" --tags app=commit -o none
done

ACR_NAME=$(az deployment group create -g rg-commit-shared -f infra/shared.bicep --query properties.outputs.acrName.value -o tsv)
ACR_ID=$(az acr show -n "$ACR_NAME" --query id -o tsv)
echo "Registro: $ACR_NAME"

# Aplicación para GitHub Actions (OIDC: solo puede usarla este repo en estos ambientes)
APP_ID=$(az ad app list --display-name commit-github-deploy --query '[0].appId' -o tsv)
if [ -z "$APP_ID" ]; then APP_ID=$(az ad app create --display-name commit-github-deploy --query appId -o tsv); fi
az ad sp show --id "$APP_ID" >/dev/null 2>&1 || az ad sp create --id "$APP_ID" -o none
for ENV in staging production; do
  NAME="github-$ENV"
  az ad app federated-credential list --id "$APP_ID" --query "[?name=='$NAME']" -o tsv | grep -q . || \
    az ad app federated-credential create --id "$APP_ID" --parameters "{\"name\":\"$NAME\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:$REPO:environment:$ENV\",\"audiences\":[\"api://AzureADTokenExchange\"]}" -o none
done
SP=$(az ad sp show --id "$APP_ID" --query id -o tsv)
for rg in rg-commit-staging rg-commit-prod; do
  az role assignment create --assignee-object-id "$SP" --assignee-principal-type ServicePrincipal --role Contributor --scope "/subscriptions/$SUB/resourceGroups/$rg" -o none
done
az role assignment create --assignee-object-id "$SP" --assignee-principal-type ServicePrincipal --role AcrPush --scope "$ACR_ID" -o none
# Para dar AcrPull a las identidades de cada ambiente desde Bicep (solo en el grupo compartido)
az role assignment create --assignee-object-id "$SP" --assignee-principal-type ServicePrincipal --role "Role Based Access Control Administrator" --scope "/subscriptions/$SUB/resourceGroups/rg-commit-shared" -o none

# Secretos por ambiente (se generan una vez; SMTP_URL y los opcionales se completan a mano)
for ENV in staging prod; do
  F="infra/.secrets.$ENV.env"
  if [ ! -f "$F" ]; then
    umask 077
    cat > "$F" <<SECRETS
PG_ADMIN_PASSWORD=$(openssl rand -base64 36 | tr -d '\n/+=' | cut -c1-32)Aa1
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
STATUS_TOKEN=$(openssl rand -hex 24)
SMTP_URL=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
ANTHROPIC_API_KEY=
SECRETS
  fi
done

# Primeras imágenes: se compilan EN Azure (x86), no en la Mac
TAG="bootstrap-$(git rev-parse --short HEAD)"
az acr build -r "$ACR_NAME" -t "commit-backend:$TAG" --target prod backend -o none
az acr build -r "$ACR_NAME" -t "commit-migrate:$TAG" --target migrate backend -o none
az acr build -r "$ACR_NAME" -t "commit-frontend:$TAG" --target prod frontend -o none
az acr build -r "$ACR_NAME" -t "commit-ocr:$TAG" ocr -o none

for ENV in staging prod; do
  set -a; . "infra/.secrets.$ENV.env"; set +a
  RG="rg-commit-$ENV" PARAMS="infra/$ENV.bicepparam" ACR_NAME="$ACR_NAME" IMAGE_TAG="$TAG" infra/scripts/deploy.sh
  # El job de migraciones recién existe después del primer despliegue: correrlo ahora
  RG="rg-commit-$ENV" PARAMS="infra/$ENV.bicepparam" ACR_NAME="$ACR_NAME" IMAGE_TAG="$TAG" infra/scripts/deploy.sh
done

cat <<INFO

✔ Listo. Configura en GitHub (Settings → Environments) los ambientes "staging" y "production":
  Variables:  ACR_NAME=$ACR_NAME
  Secretos:   AZURE_CLIENT_ID=$APP_ID  AZURE_TENANT_ID=$TENANT  AZURE_SUBSCRIPTION_ID=$SUB
              y los de infra/.secrets.staging.env / infra/.secrets.prod.env
  En "production", activa "Required reviewers" para aprobar cada pase a producción.
Después: infra/scripts/domains.sh staging  y  infra/scripts/domains.sh prod
INFO
