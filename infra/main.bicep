// Un ambiente de Commit (staging o prod) en Azure Container Apps.
// Uso: az deployment group create -g rg-commit-<env> -f infra/main.bicep -p infra/<env>.bicepparam ...
targetScope = 'resourceGroup'

@allowed(['staging', 'prod'])
param env string
param location string = resourceGroup().location

@description('Registro de imágenes compartido (infra/shared.bicep)')
param acrName string
param acrResourceGroup string = 'rg-commit-shared'
@description('Etiqueta de las imágenes a desplegar (el CI usa el SHA del commit)')
param imageTag string = 'latest'

@description('Dominios públicos (vacío = sin dominio propio todavía)')
param webDomain string = ''
param apiDomain string = ''

// Tamaños por ambiente
param pgSku string = env == 'prod' ? 'Standard_B2s' : 'Standard_B1ms'
param pgStorageGb int = 32
param redisSku string = 'Balanced_B0'
param webMinReplicas int = env == 'prod' ? 1 : 0
param apiMinReplicas int = 1 // el backend corre colas (recordatorios, cotizaciones, comprobantes)
param enableOcr bool = false

// Secretos (desde el CI o un archivo local que no se versiona)
@secure()
param pgAdminPassword string
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
param whatsappToken string = ''
@secure()
param whatsappAppSecret string = ''
@secure()
param whatsappVerifyToken string = ''
param whatsappPhoneNumberId string = ''
param whatsappDisplayNumber string = ''
param subscriptionsEnforced bool = env == 'prod'

var prefix = 'commit-${env}'
var tags = { app: 'commit', env: env }
var pgAdmin = 'commitadmin'
var acrServer = '${acrName}.azurecr.io'
var appUrl = empty(webDomain) ? 'https://commit-web.${cae.properties.defaultDomain}' : 'https://${webDomain}'

// ── Observabilidad propia (logs de los contenedores; sin telemetría externa) ──
resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${prefix}-logs'
  location: location
  tags: tags
  properties: { sku: { name: 'PerGB2018' }, retentionInDays: 30 }
}

resource cae 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${prefix}-env'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: { customerId: logs.properties.customerId, sharedKey: logs.listKeys().primarySharedKey }
    }
  }
}

// Identidad de las apps para leer imágenes del registro
resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${prefix}-identity'
  location: location
  tags: tags
}

module acrPull 'acr-pull.bicep' = {
  name: '${prefix}-acr-pull'
  scope: resourceGroup(acrResourceGroup)
  params: { acrName: acrName, principalId: identity.properties.principalId }
}

// ── PostgreSQL 18 ──
resource pg 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: '${prefix}-pg-${uniqueString(resourceGroup().id)}'
  location: location
  tags: tags
  sku: { name: pgSku, tier: 'Burstable' }
  properties: {
    version: '18'
    administratorLogin: pgAdmin
    administratorLoginPassword: pgAdminPassword
    storage: { storageSizeGB: pgStorageGb, autoGrow: 'Enabled' }
    backup: { backupRetentionDays: env == 'prod' ? 14 : 7, geoRedundantBackup: 'Disabled' }
    highAvailability: { mode: 'Disabled' }
    network: { publicNetworkAccess: 'Enabled' }
  }
}

// Las migraciones usan citext (correos sin distinguir mayúsculas)
resource pgExtensions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2024-08-01' = {
  parent: pg
  name: 'azure.extensions'
  properties: { value: 'CITEXT', source: 'user-override' }
}

// Solo servicios de Azure (las Container Apps); TLS obligatorio
resource pgFirewall 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-08-01' = {
  parent: pg
  name: 'AllowAzureServices'
  properties: { startIpAddress: '0.0.0.0', endIpAddress: '0.0.0.0' }
}

resource pgDb 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
  parent: pg
  name: 'commit'
  properties: { charset: 'UTF8', collation: 'en_US.utf8' }
}

// ── Redis (Azure Managed Redis): sesiones de refresco, códigos y colas ──
resource redis 'Microsoft.Cache/redisEnterprise@2025-04-01' = {
  name: '${prefix}-redis-${uniqueString(resourceGroup().id)}'
  location: location
  tags: tags
  sku: { name: redisSku }
  properties: { minimumTlsVersion: '1.2' }
}

resource redisDb 'Microsoft.Cache/redisEnterprise/databases@2025-04-01' = {
  parent: redis
  name: 'default'
  properties: {
    clientProtocol: 'Encrypted'
    port: 10000
    clusteringPolicy: 'EnterpriseCluster'
    evictionPolicy: 'NoEviction' // BullMQ no tolera que se borren claves
    accessKeysAuthentication: 'Enabled'
  }
}

var databaseUrl = 'postgresql://${pgAdmin}:${uriComponent(pgAdminPassword)}@${pg.properties.fullyQualifiedDomainName}:5432/commit?sslmode=require'
var redisUrl = 'rediss://:${uriComponent(redisDb.listKeys().primaryKey)}@${redis.properties.hostName}:10000'

// Secretos y variables opcionales: solo se declaran si tienen valor (Container Apps no admite
// secretos vacíos y el backend trata una variable ausente como "función desactivada").
var optional = [
  { secret: 'smtp-url', env: 'SMTP_URL', value: smtpUrl }
  { secret: 'vapid-public', env: 'VAPID_PUBLIC_KEY', value: vapidPublicKey }
  { secret: 'vapid-private', env: 'VAPID_PRIVATE_KEY', value: vapidPrivateKey }
  { secret: 'anthropic-key', env: 'ANTHROPIC_API_KEY', value: anthropicApiKey }
  { secret: 'wa-token', env: 'WHATSAPP_TOKEN', value: whatsappToken }
  { secret: 'wa-app-secret', env: 'WHATSAPP_APP_SECRET', value: whatsappAppSecret }
  { secret: 'wa-verify-token', env: 'WHATSAPP_VERIFY_TOKEN', value: whatsappVerifyToken }
]
var present = filter(optional, o => !empty(o.value))

var commonSecrets = concat([
  { name: 'database-url', value: databaseUrl }
  { name: 'redis-url', value: redisUrl }
  { name: 'jwt-secret', value: jwtSecret }
  { name: 'status-token', value: statusToken }
], map(present, o => { name: o.secret, value: o.value }))

var plainOptional = filter([
  { name: 'WHATSAPP_PHONE_NUMBER_ID', value: whatsappPhoneNumberId }
  { name: 'WHATSAPP_DISPLAY_NUMBER', value: whatsappDisplayNumber }
  { name: 'OCR_URL', value: enableOcr ? 'http://commit-ocr' : '' }
], e => !empty(e.value))

var backendEnv = concat([
  { name: 'NODE_ENV', value: 'production' }
  { name: 'PORT', value: '3000' }
  { name: 'TRUST_PROXY', value: '2' }
  { name: 'DATABASE_URL', secretRef: 'database-url' }
  { name: 'REDIS_URL', secretRef: 'redis-url' }
  { name: 'JWT_SECRET', secretRef: 'jwt-secret' }
  { name: 'STATUS_TOKEN', secretRef: 'status-token' }
  { name: 'MAIL_FROM', value: mailFrom }
  { name: 'APP_URL', value: appUrl }
  { name: 'CORS_ORIGINS', value: appUrl }
  { name: 'VAPID_SUBJECT', value: 'mailto:no-reply@atheneox.com' }
  { name: 'SUBSCRIPTIONS_ENFORCED', value: string(subscriptionsEnforced) }
], map(present, o => { name: o.env, secretRef: o.secret }), plainOptional)
var registries = [{ server: acrServer, identity: identity.id }]
var identityConfig = { type: 'UserAssigned', userAssignedIdentities: { '${identity.id}': {} } }

// ── Backend API ──
resource api 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'commit-api'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    managedEnvironmentId: cae.id
    configuration: {
      ingress: { external: true, targetPort: 3000, transport: 'auto', allowInsecure: false }
      registries: registries
      secrets: commonSecrets
    }
    template: {
      containers: [
        {
          name: 'api'
          image: '${acrServer}/commit-backend:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: backendEnv
          probes: [
            { type: 'Liveness', httpGet: { path: '/health', port: 3000 }, periodSeconds: 30 }
            { type: 'Readiness', httpGet: { path: '/ready', port: 3000 }, periodSeconds: 15 }
          ]
        }
      ]
      scale: { minReplicas: apiMinReplicas, maxReplicas: env == 'prod' ? 3 : 1 }
    }
  }
}

// ── Frontend (nginx: SPA + proxy de /api al backend) ──
resource web 'Microsoft.App/containerApps@2024-03-01' = {
  name: 'commit-web'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    managedEnvironmentId: cae.id
    configuration: {
      ingress: { external: true, targetPort: 8080, transport: 'auto', allowInsecure: false }
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
      scale: { minReplicas: webMinReplicas, maxReplicas: env == 'prod' ? 3 : 1 }
    }
  }
}

// ── OCR (opcional, interno) ──
resource ocr 'Microsoft.App/containerApps@2024-03-01' = if (enableOcr) {
  name: 'commit-ocr'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    managedEnvironmentId: cae.id
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

// ── Migraciones: job que el CI ejecuta en cada despliegue, antes de actualizar las apps ──
resource migrate 'Microsoft.App/jobs@2024-03-01' = {
  name: 'commit-migrate'
  location: location
  tags: tags
  identity: identityConfig
  dependsOn: [acrPull]
  properties: {
    environmentId: cae.id
    configuration: {
      triggerType: 'Manual'
      replicaTimeout: 600
      replicaRetryLimit: 1
      manualTriggerConfig: { parallelism: 1, replicaCompletionCount: 1 }
      registries: registries
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

output webFqdn string = web.properties.configuration.ingress.fqdn
output apiFqdn string = api.properties.configuration.ingress.fqdn
output environmentDefaultDomain string = cae.properties.defaultDomain
output environmentVerificationId string = cae.properties.customDomainConfiguration.customDomainVerificationId
output appUrl string = appUrl
output webDomain string = webDomain
output apiDomain string = apiDomain
