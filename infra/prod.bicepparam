using 'main.bicep'

param env = 'prod'
param location = 'northcentralus'
param acrName = readEnvironmentVariable('ACR_NAME')
param imageTag = readEnvironmentVariable('IMAGE_TAG', 'latest')
param webDomain = 'commit.atheneox.com'
param apiDomain = 'api-commit.atheneox.com'

// Secretos: variables de entorno (CI: secretos del ambiente "production" en GitHub)
param pgAdminPassword = readEnvironmentVariable('PG_ADMIN_PASSWORD')
param jwtSecret = readEnvironmentVariable('JWT_SECRET')
param statusToken = readEnvironmentVariable('STATUS_TOKEN')
param smtpUrl = readEnvironmentVariable('SMTP_URL', '')
param mailFrom = 'Commit <no-reply@atheneox.com>'
param vapidPublicKey = readEnvironmentVariable('VAPID_PUBLIC_KEY', '')
param vapidPrivateKey = readEnvironmentVariable('VAPID_PRIVATE_KEY', '')
param anthropicApiKey = readEnvironmentVariable('ANTHROPIC_API_KEY', '')
