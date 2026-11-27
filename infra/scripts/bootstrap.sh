#!/usr/bin/env bash
# Preparación inicial (una sola vez), con tu sesión de Azure (`az login`). Es idempotente.
#  1. Grupos de recursos y secretos generados (infra/.secrets.*, no se versionan)
#  2. Recursos compartidos: registro, PostgreSQL 18 y almacenamiento de respaldos
#  3. Roles de base de datos por ambiente (commit_staging, commit_prod)
#  4. Aplicación de Entra para GitHub Actions con OIDC (sin contraseñas) y permisos mínimos
#  5. Primeras imágenes (compiladas en Azure, x86) y primer despliegue de staging y prod
set -euo pipefail
LOCATION="${LOCATION:-northcentralus}"
REPO="${REPO:-dotforeach/commit}"
cd "$(dirname "$0")/../.."
SECRETS=infra/.secrets

SUB=$(az account show --query id -o tsv); TENANT=$(az account show --query tenantId -o tsv)
echo "Suscripción: $(az account show --query name -o tsv) ($SUB)"

# ── 1. Grupos y secretos ──
for rg in rg-commit-shared rg-commit-staging rg-commit-prod; do
  az group create -n "$rg" -l "$LOCATION" --tags app=commit -o none
done

pw() { openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | cut -c1-32; }
umask 077
[ -f "$SECRETS.shared.env" ] || echo "PG_ADMIN_PASSWORD=$(pw)" > "$SECRETS.shared.env"
for ENV in staging prod; do
  [ -f "$SECRETS.$ENV.env" ] || cat > "$SECRETS.$ENV.env" <<S
DB_PASSWORD=$(pw)
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
STATUS_TOKEN=$(openssl rand -hex 24)
SMTP_URL=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
ANTHROPIC_API_KEY=
S
done
# Clave de los respaldos: la pública cifra en Azure; la PRIVADA solo existe acá (guárdala fuera de línea)
if [ ! -f "$SECRETS.backup-age.key" ]; then
  docker run --rm alpine:3 sh -c 'apk add -q age >/dev/null && age-keygen 2>/dev/null' > "$SECRETS.backup-age.key"
fi
BACKUP_AGE_RECIPIENT=$(grep -o 'age1[0-9a-z]*' "$SECRETS.backup-age.key" | head -1)
. "$SECRETS.shared.env"

# ── 2. Compartidos ──
OUT=$(az deployment group create -g rg-commit-shared -f infra/shared.bicep -p pgAdminPassword="$PG_ADMIN_PASSWORD" --query properties.outputs -o json)
ACR_NAME=$(jq -r .acrName.value <<<"$OUT"); PG_SERVER=$(jq -r .pgServerName.value <<<"$OUT")
PG_HOST=$(jq -r .pgHost.value <<<"$OUT"); PG_ADMIN=$(jq -r .pgAdmin.value <<<"$OUT")
echo "Registro: $ACR_NAME · PostgreSQL: $PG_HOST"

# ── 3. Roles de base de datos (regla de firewall temporal para esta máquina) ──
MYIP=$(curl -s https://api.ipify.org)
az postgres flexible-server firewall-rule create -g rg-commit-shared -n "$PG_SERVER" -r bootstrap-tmp --start-ip-address "$MYIP" --end-ip-address "$MYIP" -o none
trap 'az postgres flexible-server firewall-rule delete -g rg-commit-shared -n "$PG_SERVER" -r bootstrap-tmp --yes -o none 2>/dev/null || true' EXIT
for ENV in staging prod; do
  DB_PASSWORD=$(grep '^DB_PASSWORD=' "$SECRETS.$ENV.env" | cut -d= -f2-)
  R="commit_$ENV"
  docker run --rm -e PGPASSWORD="$PG_ADMIN_PASSWORD" postgres:18-alpine psql -v ON_ERROR_STOP=1 -q \
    "host=$PG_HOST user=$PG_ADMIN dbname=postgres sslmode=require" <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$R') THEN CREATE ROLE $R LOGIN PASSWORD '$DB_PASSWORD';
  ELSE ALTER ROLE $R WITH LOGIN PASSWORD '$DB_PASSWORD'; END IF;
END \$\$;
GRANT $R TO $PG_ADMIN;
ALTER DATABASE $R OWNER TO $R;
REVOKE ALL ON DATABASE $R FROM PUBLIC;
GRANT CONNECT ON DATABASE $R TO $R;
\c $R
CREATE EXTENSION IF NOT EXISTS citext;
SQL
  echo "Rol y base $R listos"
done

# ── 4. GitHub Actions con OIDC ──
APP_ID=$(az ad app list --display-name commit-github-deploy --query '[0].appId' -o tsv)
[ -n "$APP_ID" ] || APP_ID=$(az ad app create --display-name commit-github-deploy --query appId -o tsv)
az ad sp show --id "$APP_ID" -o none 2>/dev/null || az ad sp create --id "$APP_ID" -o none
for ENV in staging production; do
  NAME="github-$ENV"
  az ad app federated-credential list --id "$APP_ID" --query "[?name=='$NAME'].name" -o tsv | grep -q . || \
    az ad app federated-credential create --id "$APP_ID" -o none --parameters \
      "{\"name\":\"$NAME\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:$REPO:environment:$ENV\",\"audiences\":[\"api://AzureADTokenExchange\"]}"
done
SP=$(az ad sp show --id "$APP_ID" --query id -o tsv)
grant() { az role assignment create --assignee-object-id "$SP" --assignee-principal-type ServicePrincipal --role "$1" --scope "$2" -o none; }
for rg in rg-commit-staging rg-commit-prod; do grant Contributor "/subscriptions/$SUB/resourceGroups/$rg"; done
grant AcrPush "$(az acr show -n "$ACR_NAME" --query id -o tsv)"
# Leer el PostgreSQL compartido y asignar AcrPull / escritura de respaldos a las identidades de cada ambiente
grant Reader "/subscriptions/$SUB/resourceGroups/rg-commit-shared"
grant "Role Based Access Control Administrator" "/subscriptions/$SUB/resourceGroups/rg-commit-shared"

# ── 5. Imágenes (compiladas en Azure) y primer despliegue ──
TAG="bootstrap-$(git rev-parse --short HEAD)"
az acr build -r "$ACR_NAME" -t "commit-backend:$TAG" --target prod backend -o none
az acr build -r "$ACR_NAME" -t "commit-migrate:$TAG" --target migrate backend -o none
az acr build -r "$ACR_NAME" -t "commit-frontend:$TAG" --target prod frontend -o none
az acr build -r "$ACR_NAME" -t "commit-ocr:$TAG" ocr -o none
az acr build -r "$ACR_NAME" -t "commit-backup:$TAG" infra/backup -o none

for ENV in staging prod; do
  ( set -a; . "$SECRETS.$ENV.env"; [ "$ENV" = prod ] && . "$SECRETS.shared.env"; BACKUP_AGE_RECIPIENT="$BACKUP_AGE_RECIPIENT"; set +a
    RG="rg-commit-$ENV" PARAMS="infra/$ENV.bicepparam" ACR_NAME="$ACR_NAME" IMAGE_TAG="$TAG" infra/scripts/deploy.sh )
done

cat <<INFO

✔ Listo. En GitHub (Settings → Environments) crea "staging" y "production" y carga en cada uno:
  Variables:  ACR_NAME=$ACR_NAME
  Secretos:   AZURE_CLIENT_ID=$APP_ID  AZURE_TENANT_ID=$TENANT  AZURE_SUBSCRIPTION_ID=$SUB
              y los de $SECRETS.staging.env / $SECRETS.prod.env
  Solo en production: PG_ADMIN_PASSWORD (de $SECRETS.shared.env) y la variable BACKUP_AGE_RECIPIENT=$BACKUP_AGE_RECIPIENT
  Activa "Required reviewers" en production.

⚠ Guarda $SECRETS.backup-age.key en tu gestor de contraseñas (sin ella los respaldos no se pueden abrir)
  y después bórrala de esta máquina.
Dominios: infra/scripts/domains.sh staging  y  infra/scripts/domains.sh prod
INFO
