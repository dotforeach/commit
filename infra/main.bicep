// Un ambiente de Commit (staging o prod) en Azure Container Apps, versión económica y bajo demanda:
//  - web, api y ocr escalan a cero (el primer pedido tras un rato sin uso los despierta)
//  - Redis va como contenedor junto al backend, con su archivo en Azure Files (no se pierden sesiones)
//  - recordatorios y cotizaciones corren como tareas programadas (no hace falta el backend encendido)
//  - PostgreSQL y el registro son compartidos (infra/shared.bicep); el ambiente es noxi-env
// Uso: az deployment group create -g rg-commit-<env> -f infra/main.bicep -p infra/<env>.bicepparam
targetScope = 'resourceGroup'

@allowed(['staging', 'prod'])
param env string
param location string = resourceGroup().location
param sharedResourceGroup string = 'rg-commit-shared'
@description('Etiqueta de las imágenes (el CI usa el SHA del commit)')
param imageTag string = 'latest'

@description('Dominios públicos (vacío = todavía sin dominio propio)')
param webDomain string = ''
param apiDomain string = ''
@description('Certificado administrado ya emitido para cada dominio (lo busca deploy.sh). Sin él, el dominio no se declara.')
param webCertificateId string = ''
param apiCertificateId string = ''

param enableOcr bool = false
@description('Cada cuánto se revisan los recordatorios vencidos (cron, UTC)')
param remindersSchedule string = '*/5 * * * *'
param ratesSchedule string = '7 * * * *'
@description('Respaldo diario (solo prod; respalda las dos bases). 07:00 UTC = 02:00 en Panamá')
param backupSchedule string = '0 7 * * *'

// Secretos
@secure()
@description('Contraseña del rol de base de datos de este ambiente (commit_<env>)')
param dbPassword string
@secure()
@description('Solo prod: contraseña del administrador, para el respaldo de ambas bases')
param pgAdminPassword string = ''
@description('Solo prod: clave pública age con la que se cifran los respaldos')
param backupAgeRecipient string = ''
@secure()
param jwtSecret string
@secure()
param statusToken string
@secure()
param smtpUrl string = ''
param mailFrom string = 'Commit <no-reply@atheneox.com>'
@secure()
param vapidPublicKey string = ''
@secure()
param vapidPrivateKey string = ''
@secure()
param anthropicApiKey string = ''
@secure()
param openRouterApiKey string = ''
@allowed(['auto', 'anthropic', 'openrouter'])
param aiProvider string = 'auto'
@secure()
param whatsappToken string = ''
@secure()
param whatsappAppSecret string = ''
@secure()
param whatsappVerifyToken string = ''
param whatsappPhoneNumberId string = ''
param whatsappDisplayNumber string = ''
@secure()
@description('Clave del HMAC de los números de WhatsApp (sin ella se deriva de JWT_SECRET)')
param phoneHashKey string = ''
param subscriptionsEnforced bool = env == 'prod'

var names = loadJsonContent('names.json')
var suffix = uniqueString(subscription().id, 'commit')
var acrName = '${names.acr}${suffix}'
var acrServer = '${acrName}.azurecr.io'
var backupsAccount = '${names.backups}${suffix}'
var prefix = 'commit-${env}'
var tags = { app: 'commit', env: env }
var appUrl = empty(webDomain) ? 'https://${prefix}-web.${cae.properties.defaultDomain}' : 'https://${webDomain}'
var dbName = 'commit_${env}'

resource pg 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' existing = {
  name: '${names.pg}-${suffix}'
  scope: resourceGroup(sharedResourceGroup)
}
var pgHost = pg.properties.fullyQualifiedDomainName

// Ambiente de Container Apps compartido (noxi-env, grupo Noxi: la suscripción admite uno solo y Azure
// no permite renombrarlo). Las apps viven en el grupo de cada ambiente y llevan el ambiente en el nombre.
resource cae 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: names.env
  scope: resourceGroup(names.envGroup)
}

// Identidad de las apps: leer imágenes del registro (y, en prod, escribir respaldos)
resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${prefix}-identity'
  location: location
  tags: tags
}

module acrPull 'role.bicep' = {
  name: '${prefix}-acr-pull'
  scope: resourceGroup(sharedResourceGroup)
  params: { target: 'acr', resourceName: acrName, principalId: identity.properties.principalId, roleId: '7f951dda-4ed3-4680-a7ca-43fe172d538d' }
}

// ── Disco de Redis (Azure Files): el archivo de Redis sobrevive cuando el backend escala a cero ──
resource redisStorage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'commitrs${env == 'prod' ? 'prd' : 'stg'}${suffix}'
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: { minimumTlsVersion: 'TLS1_2', supportsHttpsTrafficOnly: true, allowBlobPublicAccess: false }
}

resource redisShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  name: '${redisStorage.name}/default/redis'
  properties: { shareQuota: 1, accessTier: 'TransactionOptimized' }
}

module caeStorage 'env-storage.bicep' = {
  name: '${prefix}-redis-storage'
  scope: resourceGroup(names.envGroup)
  params: {
    environmentName: names.env
    storageName: 'redis-${env}'
    accountName: redisStorage.name
    accountKey: redisStorage.listKeys().keys[0].value
    shareName: 'redis'
  }
  dependsOn: [redisShare]
}

// ── Secretos y variables del backend ──
var databaseUrl = 'postgresql://${dbName}:${uriComponent(dbPassword)}@${pgHost}:5432/${dbName}?sslmode=require'

// Opcionales: solo se declaran si tienen valor (Container Apps no admite secretos vacíos y el
// backend trata una variable ausente como "función desactivada").
var optional = [
  { secret: 'smtp-url', env: 'SMTP_URL', value: smtpUrl }
  { secret: 'vapid-public', env: 'VAPID_PUBLIC_KEY', value: vapidPublicKey }
  { secret: 'vapid-private', env: 'VAPID_PRIVATE_KEY', value: vapidPrivateKey }
  { secret: 'anthropic-key', env: 'ANTHROPIC_API_KEY', value: anthropicApiKey }
  { secret: 'openrouter-key', env: 'OPENROUTER_API_KEY', value: openRouterApiKey }
  { secret: 'wa-token', env: 'WHATSAPP_TOKEN', value: whatsappToken }
  { secret: 'wa-app-secret', env: 'WHATSAPP_APP_SECRET', value: whatsappAppSecret }
  { secret: 'wa-verify-token', env: 'WHATSAPP_VERIFY_TOKEN', value: whatsappVerifyToken }
  { secret: 'phone-hash-key', env: 'PHONE_HASH_KEY', value: phoneHashKey }
]
var present = filter(optional, o => !empty(o.value))

var backendSecrets = concat([
  { name: 'database-url', value: databaseUrl }
  { name: 'jwt-secret', value: jwtSecret }
  { name: 'status-token', value: statusToken }
], map(present, o => { name: o.secret, value: o.value }))

var plainOptional = filter([
  { name: 'WHATSAPP_PHONE_NUMBER_ID', value: whatsappPhoneNumberId }
  { name: 'WHATSAPP_DISPLAY_NUMBER', value: whatsappDisplayNumber }
  { name: 'OCR_URL', value: enableOcr ? 'http://${prefix}-ocr' : '' }
], e => !empty(e.value))

var backendEnv = concat([
  { name: 'NODE_ENV', value: 'production' }
  { name: 'PORT', value: '3000' }
  { name: 'TRUST_PROXY', value: '2' }
  { name: 'DATABASE_URL', secretRef: 'database-url' }
  { name: 'REDIS_URL', value: 'redis://127.0.0.1:6379' } // contenedor de Redis en la misma réplica
  { name: 'JWT_SECRET', secretRef: 'jwt-secret' }
  { name: 'STATUS_TOKEN', secretRef: 'status-token' }
  { name: 'MAIL_FROM', value: mailFrom }
  { name: 'APP_URL', value: appUrl }
  { name: 'CORS_ORIGINS', value: appUrl }
  { name: 'VAPID_SUBJECT', value: 'mailto:no-reply@atheneox.com' }
  { name: 'SUBSCRIPTIONS_ENFORCED', value: string(subscriptionsEnforced) }
  { name: 'AI_PROVIDER', value: aiProvider }
  // Los dispara una tarea programada (abajo), no el backend
  { name: 'REMINDERS_JOB', value: 'false' }
  { name: 'RATES_REFRESH', value: 'false' }
], map(present, o => { name: o.env, secretRef: o.secret }), plainOptional)

var registries = [{ server: acrServer, identity: identity.id }]
var identityConfig = { type: 'UserAssigned', userAssignedIdentities: { '${identity.id}': {} } }

// ── Backend API + Redis (bajo demanda) ──
resource api 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-api'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull, caeStorage]
  properties: {
    managedEnvironmentId: cae.id
    workloadProfileName: 'Consumption'
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
        allowInsecure: false
        // Declarar los dominios: si no, cada despliegue los quita
        customDomains: empty(apiDomain) || empty(apiCertificateId) ? [] : [{ name: apiDomain, certificateId: apiCertificateId, bindingType: 'SniEnabled' }]
      }
      registries: registries
      secrets: backendSecrets
    }
    template: {
      containers: [
        {
          name: 'api'
          image: '${acrServer}/commit-backend:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: backendEnv
          probes: [
            { type: 'Startup', httpGet: { path: '/health', port: 3000 }, periodSeconds: 2, failureThreshold: 30 }
            { type: 'Readiness', httpGet: { path: '/ready', port: 3000 }, periodSeconds: 15 }
            { type: 'Liveness', httpGet: { path: '/health', port: 3000 }, periodSeconds: 30 }
          ]
        }
        {
          // Solo escucha en localhost. Guarda una foto (RDB) cada minuto si hubo cambios y al apagarse.
          // Se ejecuta redis-server directo (sin el entrypoint, que intenta chown sobre Azure Files).
          name: 'redis'
          image: 'docker.io/library/redis:8-alpine'
          command: ['redis-server']
          args: ['--bind', '127.0.0.1', '--dir', '/data', '--save', '60 1', '--appendonly', 'no', '--maxmemory-policy', 'noeviction']
          resources: { cpu: json('0.25'), memory: '0.5Gi' }
          volumeMounts: [{ volumeName: 'redis-data', mountPath: '/data' }]
        }
      ]
      volumes: [{ name: 'redis-data', storageType: 'AzureFile', storageName: 'redis-${env}' }]
      // Máximo 1: el Redis de la réplica es la única copia de sesiones y colas
      scale: { minReplicas: 0, maxReplicas: 1, rules: [{ name: 'http', http: { metadata: { concurrentRequests: '50' } } }] }
    }
  }
}

// ── Frontend (nginx: SPA + proxy de /api al backend), bajo demanda ──
resource web 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-web'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    managedEnvironmentId: cae.id
    workloadProfileName: 'Consumption'
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'auto'
        allowInsecure: false
        customDomains: empty(webDomain) || empty(webCertificateId) ? [] : [{ name: webDomain, certificateId: webCertificateId, bindingType: 'SniEnabled' }]
      }
      registries: registries
    }
    template: {
      containers: [
        {
          name: 'web'
          image: '${acrServer}/commit-frontend:${imageTag}'
          resources: { cpu: json('0.25'), memory: '0.5Gi' }
          env: [
            { name: 'BACKEND_UPSTREAM', value: 'https://${api.properties.configuration.ingress.fqdn}' }
            { name: 'BACKEND_HOST', value: api.properties.configuration.ingress.fqdn }
          ]
        }
      ]
      scale: { minReplicas: 0, maxReplicas: 2, rules: [{ name: 'http', http: { metadata: { concurrentRequests: '100' } } }] }
    }
  }
}

// ── OCR (opcional, interno, bajo demanda) ──
resource ocr 'Microsoft.App/containerApps@2024-03-01' = if (enableOcr) {
  name: '${prefix}-ocr'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    managedEnvironmentId: cae.id
    workloadProfileName: 'Consumption'
    configuration: {
      ingress: { external: false, targetPort: 8000, transport: 'http', allowInsecure: true }
      registries: registries
    }
    template: {
      containers: [{ name: 'ocr', image: '${acrServer}/commit-ocr:${imageTag}', resources: { cpu: json('1'), memory: '2Gi' } }]
      scale: { minReplicas: 0, maxReplicas: 1 }
    }
  }
}

// ── Tareas ──
var jobBase = {
  environmentId: cae.id
  registries: registries
}

// Migraciones: el CI la ejecuta en cada despliegue, antes de actualizar las apps
resource migrate 'Microsoft.App/jobs@2024-03-01' = {
  name: '${prefix}-migrate'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    environmentId: jobBase.environmentId
    workloadProfileName: 'Consumption'
    configuration: {
      triggerType: 'Manual'
      replicaTimeout: 600
      replicaRetryLimit: 1
      manualTriggerConfig: { parallelism: 1, replicaCompletionCount: 1 }
      registries: jobBase.registries
      secrets: [{ name: 'database-url', value: databaseUrl }]
    }
    template: {
      containers: [
        {
          name: 'migrate'
          image: '${acrServer}/commit-migrate:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: [{ name: 'DATABASE_URL', secretRef: 'database-url' }]
        }
      ]
    }
  }
}

// Recordatorios y cotizaciones: una pasada y se apaga (node dist/cron.js <tarea>)
var cronTasks = [
  { name: '${prefix}-reminders', task: 'reminders', schedule: remindersSchedule }
  { name: '${prefix}-rates', task: 'rates', schedule: ratesSchedule }
]

resource crons 'Microsoft.App/jobs@2024-03-01' = [for t in cronTasks: {
  name: t.name
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    environmentId: jobBase.environmentId
    workloadProfileName: 'Consumption'
    configuration: {
      triggerType: 'Schedule'
      replicaTimeout: 300
      replicaRetryLimit: 0
      scheduleTriggerConfig: { cronExpression: t.schedule, parallelism: 1, replicaCompletionCount: 1 }
      registries: jobBase.registries
      secrets: backendSecrets
    }
    template: {
      containers: [
        {
          name: 'cron'
          image: '${acrServer}/commit-backend:${imageTag}'
          command: ['node', 'dist/cron.js', t.task]
          resources: { cpu: json('0.25'), memory: '0.5Gi' }
          env: backendEnv
        }
      ]
    }
  }
}]

// Respaldo diario cifrado de ambas bases (solo en prod) → Blob Storage compartido
module backupWriter 'role.bicep' = if (env == 'prod') {
  name: '${prefix}-backup-writer'
  scope: resourceGroup(sharedResourceGroup)
  params: { target: 'backups', resourceName: backupsAccount, principalId: identity.properties.principalId, roleId: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe' } // Storage Blob Data Contributor
}

resource backup 'Microsoft.App/jobs@2024-03-01' = if (env == 'prod') {
  name: 'commit-backup'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull, backupWriter]
  properties: {
    environmentId: jobBase.environmentId
    workloadProfileName: 'Consumption'
    configuration: {
      triggerType: 'Schedule'
      replicaTimeout: 1800
      replicaRetryLimit: 1
      scheduleTriggerConfig: { cronExpression: backupSchedule, parallelism: 1, replicaCompletionCount: 1 }
      registries: jobBase.registries
      secrets: [{ name: 'pg-admin-password', value: empty(pgAdminPassword) ? 'unset' : pgAdminPassword }]
    }
    template: {
      containers: [
        {
          name: 'backup'
          image: '${acrServer}/commit-backup:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: [
            { name: 'PGHOST', value: pgHost }
            { name: 'PGUSER', value: names.pgAdmin }
            { name: 'PGPASSWORD', secretRef: 'pg-admin-password' }
            { name: 'PGSSLMODE', value: 'require' }
            { name: 'DATABASES', value: 'commit_prod commit_staging' }
            { name: 'AGE_RECIPIENT', value: backupAgeRecipient }
            { name: 'STORAGE_ACCOUNT', value: backupsAccount }
            { name: 'CONTAINER', value: 'pg-backups' }
            { name: 'AZURE_CLIENT_ID', value: identity.properties.clientId }
          ]
        }
      ]
    }
  }
}

output webFqdn string = web.properties.configuration.ingress.fqdn
output apiFqdn string = api.properties.configuration.ingress.fqdn
output environmentVerificationId string = cae.properties.customDomainConfiguration.customDomainVerificationId
output appUrl string = appUrl
output webDomain string = webDomain
output apiDomain string = apiDomain
