#!/usr/bin/env bash
# Preparación inicial (una sola vez), con tu sesión de Azure (`az login`). Es idempotente.
#  1. Grupos de recursos y secretos generados (infra/.secrets.*, no se versionan)
#  2. Recursos compartidos: registro, PostgreSQL 18 y almacenamiento de respaldos
#  3. Roles de base de datos por ambiente (commit_staging, commit_prod)
#  4. Identidad administrada para GitHub Actions con OIDC (sin contraseñas) y permisos mínimos
#  5. Primeras imágenes (x86, con BuildKit) y primer despliegue de staging y prod
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
SMTP_URL=${SMTP_URL:-}
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
az postgres flexible-server firewall-rule create -g rg-commit-shared --server-name "$PG_SERVER" --name bootstrap-tmp --start-ip-address "$MYIP" --end-ip-address "$MYIP" -o none
trap 'az postgres flexible-server firewall-rule delete -g rg-commit-shared --server-name "$PG_SERVER" --name bootstrap-tmp --yes -o none 2>/dev/null || true' EXIT
for ENV in staging prod; do
  DB_PASSWORD=$(grep '^DB_PASSWORD=' "$SECRETS.$ENV.env" | cut -d= -f2-)
  R="commit_$ENV"
  docker run --rm -i -e PGPASSWORD="$PG_ADMIN_PASSWORD" postgres:18-alpine psql -v ON_ERROR_STOP=1 -q \
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
-- En Azure, public no es del dueño de la base (pg_database_owner): dárselo al rol del ambiente
ALTER SCHEMA public OWNER TO $R;
SQL
  # Verificar de verdad: el rol entra a su base con su contraseña
  docker run --rm -e PGPASSWORD="$DB_PASSWORD" postgres:18-alpine psql -tAc "select 1" \
    "host=$PG_HOST user=$R dbname=$R sslmode=require" | grep -q 1 || { echo "✗ El rol $R no puede entrar"; exit 1; }
  echo "Rol y base $R listos (verificado)"
done

# ── 4. GitHub Actions con OIDC ──
# Identidad administrada (no una aplicación de Entra): vive en la suscripción y no toca el directorio
# de la organización. Solo la puede usar este repo, desde los ambientes staging y production.
az identity create -g rg-commit-shared -n commit-github-deploy -l "$LOCATION" --tags app=commit -o none
APP_ID=$(az identity show -g rg-commit-shared -n commit-github-deploy --query clientId -o tsv)
SP=$(az identity show -g rg-commit-shared -n commit-github-deploy --query principalId -o tsv)
# GitHub puede enviar el sujeto con nombres (repo:dueño/repo:…) o con IDs (repo:dueño@ID/repo@ID:…):
# se registran ambos formatos.
OWNER_ID=$(curl -s "https://api.github.com/users/${REPO%%/*}" | jq -r .id)
REPO_ID=$(curl -s "https://api.github.com/repos/$REPO" | jq -r .id)
fed() { # nombre sujeto
  az identity federated-credential show -g rg-commit-shared --identity-name commit-github-deploy -n "$1" -o none 2>/dev/null || \
    az identity federated-credential create -g rg-commit-shared --identity-name commit-github-deploy -n "$1" -o none \
      --issuer https://token.actions.githubusercontent.com --subject "$2" --audiences api://AzureADTokenExchange
}
for ENV in staging production; do
  fed "github-$ENV" "repo:$REPO:environment:$ENV"
  [ "$OWNER_ID" != null ] && [ "$REPO_ID" != null ] && fed "github-$ENV-ids" "repo:${REPO%%/*}@$OWNER_ID/${REPO#*/}@$REPO_ID:environment:$ENV"
done
grant() { az role assignment create --assignee-object-id "$SP" --assignee-principal-type ServicePrincipal --role "$1" --scope "$2" -o none; }
for rg in rg-commit-staging rg-commit-prod; do grant Contributor "/subscriptions/$SUB/resourceGroups/$rg"; done
grant AcrPush "$(az acr show -n "$ACR_NAME" --query id -o tsv)"
# Asignar AcrPull / escritura de respaldos a las identidades de cada ambiente
# Leer los compartidos; en Noxi (grupo del ambiente noxi-env): registrar los discos de Redis y unir las apps
grant Reader "/subscriptions/$SUB/resourceGroups/rg-commit-shared"
grant Contributor "/subscriptions/$SUB/resourceGroups/Noxi"
grant "Role Based Access Control Administrator" "/subscriptions/$SUB/resourceGroups/rg-commit-shared"
# Crear los despliegues anidados de main.bicep en el grupo compartido (rol mínimo, sin acceso a los recursos)
SHARED="/subscriptions/$SUB/resourceGroups/rg-commit-shared"
az role definition list --custom-role-only true --query "[?roleName=='Commit Deployments (shared)'].roleName" -o tsv | grep -q . || \
  az role definition create -o none --role-definition "{\"Name\":\"Commit Deployments (shared)\",\"Description\":\"Despliegues ARM anidados en rg-commit-shared\",\"Actions\":[\"Microsoft.Resources/deployments/*\",\"Microsoft.Resources/subscriptions/resourceGroups/read\"],\"NotActions\":[],\"AssignableScopes\":[\"$SHARED\"]}"
for _ in $(seq 1 12); do grant "Commit Deployments (shared)" "$SHARED" 2>/dev/null && break; sleep 10; done  # el rol nuevo tarda en propagarse

# ── 5. Imágenes y primer despliegue ──
# Se compilan acá para x86 (linux/amd64) con BuildKit (los Dockerfiles usan caché de pnpm, que el
# compilador de ACR no soporta) y se suben directo al registro. Después las compila el CI.
TAG="bootstrap-$(git rev-parse --short HEAD)"
R="$ACR_NAME.azurecr.io"
az acr login -n "$ACR_NAME" -o none
img() { docker buildx build --platform linux/amd64 --push "$@"; }
img --target prod    -t "$R/commit-backend:$TAG"  backend
img --target migrate -t "$R/commit-migrate:$TAG"  backend
img --target prod    -t "$R/commit-frontend:$TAG" frontend
img                  -t "$R/commit-backup:$TAG"   infra/backup
[ "${WITH_OCR:-false}" = true ] && img -t "$R/commit-ocr:$TAG" ocr

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
