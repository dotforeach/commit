// Recursos compartidos por staging y producción (rg-commit-shared):
//  - registro de imágenes (ACR Basic)
//  - un solo PostgreSQL 18 (B1ms) con una base por ambiente
//  - almacenamiento de los respaldos diarios cifrados (Blob, nivel Cool)
//  (el ambiente de Container Apps es noxi-env, en el grupo Noxi: la suscripción admite uno solo)
targetScope = 'resourceGroup'

param location string = resourceGroup().location
@secure()
@description('Contraseña del administrador de PostgreSQL (solo para preparar roles y respaldos)')
param pgAdminPassword string
param pgSku string = 'Standard_B1ms'
param pgStorageGb int = 32

// Nombres deterministas: main.bicep calcula los mismos (names.json + el mismo sufijo)
var names = loadJsonContent('names.json')
var suffix = uniqueString(subscription().id, 'commit')
var tags = { app: 'commit', env: 'shared' }

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${names.acr}${suffix}'
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: false } // las apps leen con identidad administrada; el CI publica con OIDC
  tags: tags
}

// ── PostgreSQL 18 compartido ──
resource pg 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: '${names.pg}-${suffix}'
  location: location
  tags: tags
  sku: { name: pgSku, tier: 'Burstable' }
  properties: {
    version: '18'
    administratorLogin: names.pgAdmin
    administratorLoginPassword: pgAdminPassword
    storage: { storageSizeGB: pgStorageGb, autoGrow: 'Enabled' }
    // Respaldo automático de Azure (restauración a cualquier minuto de los últimos 7 días; gratis hasta 32 GB)
    backup: { backupRetentionDays: 7, geoRedundantBackup: 'Disabled' }
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

resource pgTls 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2024-08-01' = {
  parent: pg
  name: 'require_secure_transport'
  properties: { value: 'on', source: 'user-override' }
  dependsOn: [pgExtensions] // Azure aplica las configuraciones de a una
}

// Solo servicios de Azure (las Container Apps)
resource pgFirewall 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-08-01' = {
  parent: pg
  name: 'AllowAzureServices'
  properties: { startIpAddress: '0.0.0.0', endIpAddress: '0.0.0.0' }
}

resource dbs 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = [for env in ['staging', 'prod']: {
  parent: pg
  name: 'commit_${env}'
  properties: { charset: 'UTF8', collation: 'en_US.utf8' }
}]

// ── Respaldos diarios cifrados ──
resource backups 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: '${names.backups}${suffix}'
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    accessTier: 'Cool'
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false // solo identidades de Entra (la tarea de respaldo y tu sesión)
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: backups
  name: 'default'
  properties: {
    deleteRetentionPolicy: { enabled: true, days: 7 } // un borrado accidental se puede deshacer por 7 días
    containerDeleteRetentionPolicy: { enabled: true, days: 7 }
  }
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'pg-backups'
  properties: { publicAccess: 'None' }
}

// Retención: 30 diarios y 12 mensuales
resource lifecycle 'Microsoft.Storage/storageAccounts/managementPolicies@2023-05-01' = {
  parent: backups
  name: 'default'
  properties: {
    policy: {
      rules: [
        {
          name: 'daily-30d'
          enabled: true
          type: 'Lifecycle'
          definition: {
            filters: { blobTypes: ['blockBlob'], prefixMatch: ['pg-backups/daily/'] }
            actions: { baseBlob: { delete: { daysAfterCreationGreaterThan: 30 } } }
          }
        }
        {
          name: 'monthly-365d'
          enabled: true
          type: 'Lifecycle'
          definition: {
            filters: { blobTypes: ['blockBlob'], prefixMatch: ['pg-backups/monthly/'] }
            actions: { baseBlob: { delete: { daysAfterCreationGreaterThan: 365 } } }
          }
        }
      ]
    }
  }
}

output acrName string = acr.name
output pgServerName string = pg.name
output pgHost string = pg.properties.fullyQualifiedDomainName
output pgAdmin string = names.pgAdmin
output backupsAccount string = backups.name
