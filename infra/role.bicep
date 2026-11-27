// Asigna un rol sobre un recurso del grupo compartido a la identidad de un ambiente.
targetScope = 'resourceGroup'

@allowed(['acr', 'backups'])
param target string
param resourceName string
param principalId string
param roleId string

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = if (target == 'acr') {
  name: resourceName
}
resource backups 'Microsoft.Storage/storageAccounts@2023-05-01' existing = if (target == 'backups') {
  name: resourceName
}

var role = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleId)

resource onAcr 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (target == 'acr') {
  name: guid(resourceGroup().id, resourceName, principalId, roleId)
  scope: acr
  properties: { roleDefinitionId: role, principalId: principalId, principalType: 'ServicePrincipal' }
}

resource onBackups 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (target == 'backups') {
  name: guid(resourceGroup().id, resourceName, principalId, roleId)
  scope: backups
  properties: { roleDefinitionId: role, principalId: principalId, principalType: 'ServicePrincipal' }
}
