using 'main.bicep'

param env = 'prod'
param location = 'northcentralus'
param imageTag = readEnvironmentVariable('IMAGE_TAG', 'latest')
param webDomain = 'commit.atheneox.com'
param apiDomain = 'api-commit.atheneox.com'
param webCertificateId = readEnvironmentVariable('WEB_CERT_ID', '')
param apiCertificateId = readEnvironmentVariable('API_CERT_ID', '')
param mailFrom = 'Commit <no-reply@atheneox.com>'

// Secretos: variables de entorno (CI: secretos del ambiente "production" en GitHub)
param dbPassword = readEnvironmentVariable('DB_PASSWORD')
param pgAdminPassword = readEnvironmentVariable('PG_ADMIN_PASSWORD')
param backupAgeRecipient = readEnvironmentVariable('BACKUP_AGE_RECIPIENT')
param jwtSecret = readEnvironmentVariable('JWT_SECRET')
param statusToken = readEnvironmentVariable('STATUS_TOKEN')
param smtpUrl = readEnvironmentVariable('SMTP_URL', '')
param vapidPublicKey = readEnvironmentVariable('VAPID_PUBLIC_KEY', '')
param vapidPrivateKey = readEnvironmentVariable('VAPID_PRIVATE_KEY', '')
param anthropicApiKey = readEnvironmentVariable('ANTHROPIC_API_KEY', '')
param openRouterApiKey = readEnvironmentVariable('OPENROUTER_API_KEY', '')
