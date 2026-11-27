// Recursos compartidos entre staging y producción: el registro de imágenes (ACR).
targetScope = 'resourceGroup'

@description('Región de Azure')
param location string = resourceGroup().location

@description('Nombre del registro (solo letras y números, único en Azure)')
param acrName string = 'commitacr${uniqueString(resourceGroup().id)}'

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: false // las apps leen con identidad administrada; el CI publica con OIDC
  }
  tags: { app: 'commit' }
}

output acrName string = acr.name
output acrLoginServer string = acr.properties.loginServer
output acrId string = acr.id
