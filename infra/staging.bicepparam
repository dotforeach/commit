using 'main.bicep'

param env = 'staging'
param location = 'northcentralus'
param imageTag = readEnvironmentVariable('IMAGE_TAG', 'latest')
param webDomain = 'staging-commit.atheneox.com'
param apiDomain = 'api-staging-commit.atheneox.com'
param webCertificateId = readEnvironmentVariable('WEB_CERT_ID', '')
param apiCertificateId = readEnvironmentVariable('API_CERT_ID', '')
param mailFrom = 'Commit Staging <no-reply@atheneox.com>'

// Secretos: variables de entorno (CI: secretos del ambiente "staging" en GitHub)
param dbPassword = readEnvironmentVariable('DB_PASSWORD')
param jwtSecret = readEnvironmentVariable('JWT_SECRET')
param statusToken = readEnvironmentVariable('STATUS_TOKEN')
param smtpUrl = readEnvironmentVariable('SMTP_URL', '')
param vapidPublicKey = readEnvironmentVariable('VAPID_PUBLIC_KEY', '')
param vapidPrivateKey = readEnvironmentVariable('VAPID_PRIVATE_KEY', '')
param anthropicApiKey = readEnvironmentVariable('ANTHROPIC_API_KEY', '')
