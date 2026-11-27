// Disco (Azure Files) registrado en el ambiente compartido de Container Apps.
targetScope = 'resourceGroup'

param environmentName string
param storageName string
param accountName string
@secure()
param accountKey string
param shareName string

resource cae 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: environmentName
}

resource storage 'Microsoft.App/managedEnvironments/storages@2024-03-01' = {
  parent: cae
  name: storageName
  properties: {
    azureFile: { accountName: accountName, accountKey: accountKey, shareName: shareName, accessMode: 'ReadWrite' }
  }
}
