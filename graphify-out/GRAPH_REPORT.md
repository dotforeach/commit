# Graph Report - commit  (2026-11-27)

## Corpus Check
- 361 files · ~168,770 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 56 file(s) not represented in the graph (top: .scss 26, (none) 16, .bicep 3)

## Summary
- 3038 nodes · 7453 edges · 164 communities (107 shown, 57 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29c3076f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SavingsService
- scripts
- frontend
- members.ts
- dependencies
- .login
- status.service.ts
- articles.ts
- accounts.schemas.ts
- Env
- compilerOptions
- test/helpers.ts
- dependencies
- debt-math.ts
- frontend/package.json
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- debit-card-page.ts
- TransactionsService
- backend-dev
- frontend
- environment
- x-backend-env
- frontend-dev
- TransactionsPage
- status.service.ts
- auth.controller.ts
- ReceiptsService
- keys.e2e-spec.ts
- RatesService
- progress-engine.ts
- app.module.ts
- ProgressController
- deposits.ts
- recommend.ts
- DepositsService
- DepositsService
- health.controller.ts
- CurrentUser
- budgets/budgets.service.ts
- recurring.schemas.ts
- receipts.controller.ts
- home.ts
- InvestmentsService
- @angular/core
- App
- decimal.ts
- nest-cli.dev.json
- scripts
- installments/installments.service.ts
- .deleteAccount
- features/accounts/accounts.service.ts
- WhatsappClient
- redis
- BudgetPage
- debts-page.ts
- AccountService
- PrismaService
- src/transactions/transactions.service.ts
- account.controller.ts
- recurring-page.ts
- frontend/package.json
- e2e/helpers.ts
- backend/README.md
- Converter
- AppMailer
- .require
- Commit 🐷
- MembersService
- OcrClient
- backend/package.json
- parseDecimalInput
- app.py
- goal-dialog.ts
- HouseholdService
- home.ts
- HouseholdPage
- key-vault.service.ts
- receipts.controller.ts
- ReceiptsService
- ngsw-config.json
- dotenv
- Recover
- tools-math.ts
- Register
- Facturas por WhatsApp
- rates.e2e-spec.ts
- Unlock
- AccountService
- RuleDialog
- savings.e2e-spec.ts
- adminer
- AccountsPage
- Frontend
- keys.service.ts
- production
- Operación
- services
- KeyVaultService
- .oxlintrc.json
- card-cycle.ts
- PlanService
- allowBuilds
- notifications.module.ts
- nest-cli.json
- subset.py
- home.ts
- StatusPage
- AccountSecurityCard
- backup.sh
- allowBuilds
- .require
- scan.mjs
- @angular/compiler@^22.3.0
- RatesScheduler
- PlanPage
- CreditCardPage
- AutoLockService
- Login
- SettingsPage
- ProgressService
- ci.yml
- @fontsource/roboto@5.3.0
- Arquitectura
- Flujos principales
- Variables de entorno
- ForgotPasswordPage
- material-symbols@0.49.0
- VerifyEmailPage
- deploy.yml
- with
- env
- Despliegue en Azure
- backend
- steps
- rxjs@~7.8.0
- postgres
- with
- staging
- restore.sh
- RatesPage
- frontend
- migrate
- workflow_run
- SubscriptionPage
- redis
- build
- EsArDateAdapter
- WhatsappCard
- e2e
- FakePush
- ResetPasswordPage
- ChangePassphrase
- ArticlePage
- smoke.sh
- bootstrap.sh
- deploy.sh
- domains.sh

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 90 edges
2. `@angular/core` - 90 edges
3. `PrismaService` - 75 edges
4. `@angular/material` - 57 edges
5. `@jsverse/transloco` - 57 edges
6. `parseDecimalInput()` - 57 edges
7. `@angular/common` - 49 edges
8. `@angular/router` - 47 edges
9. `KeyVaultService` - 46 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `registered()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/keys.e2e-spec.ts → backend/test/helpers.ts
- `user()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/rates.e2e-spec.ts → backend/test/helpers.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `amountOrEmpty()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/onboarding/onboarding-page.ts → frontend/src/app/core/money/decimal.ts

## Import Cycles
- None detected.

## Communities (164 total, 57 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.06
Nodes (31): TradeDialog, averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress (+23 more)

### Community 1 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, api:types, build, e2e, icons:check, icons:subset, ng, start (+2 more)

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "members.ts"
Cohesion: 0.12
Nodes (9): RegisterInput, AuthService, JwtAuth, memberKeySignedMessage(), AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect (+1 more)

### Community 4 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2 (+22 more)

### Community 6 - "status.service.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "articles.ts"
Cohesion: 0.16
Nodes (16): Article, Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, ARTICLES (+8 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.07
Nodes (18): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+10 more)

### Community 9 - "Env"
Cohesion: 0.12
Nodes (11): Env, envSchema, CRON_TASKS, CronModule, runCron(), DisabledMailTransport, PrismaModule, RATES_QUEUE (+3 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.17
Nodes (19): newUser(), payload(), payload(), setup(), payload(), setup(), b64(), buildRegistration() (+11 more)

### Community 12 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0, @angular/service-worker@^22.3.0 (+10 more)

### Community 13 - "debt-math.ts"
Cohesion: 0.06
Nodes (31): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+23 more)

### Community 14 - "frontend/package.json"
Cohesion: 0.17
Nodes (8): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), RateSources

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (21): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+13 more)

### Community 18 - "debit-card-page.ts"
Cohesion: 0.10
Nodes (20): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+12 more)

### Community 20 - "backend-dev"
Cohesion: 0.15
Nodes (13): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+5 more)

### Community 21 - "frontend"
Cohesion: 0.20
Nodes (10): condition, backend, BACKEND_HOST, BACKEND_UPSTREAM, depends_on, environment, ports, profiles (+2 more)

### Community 22 - "environment"
Cohesion: 0.17
Nodes (30): environment, environment, ANTHROPIC_API_KEY, APP_URL, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, EXTRACTION_MODEL (+22 more)

### Community 23 - "x-backend-env"
Cohesion: 0.08
Nodes (24): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, EXTRACTION_MODEL, JWT_SECRET, MAIL_FROM, OCR_URL, PHONE_HASH_KEY (+16 more)

### Community 24 - "frontend-dev"
Cohesion: 0.19
Nodes (14): build, build, context, target, API_PROXY_TARGET, build, build, depends_on (+6 more)

### Community 25 - "TransactionsPage"
Cohesion: 0.15
Nodes (3): LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "status.service.ts"
Cohesion: 0.11
Nodes (7): service, StatusController, StatusModule, NodeState, probe(), StatusNode, StatusService

### Community 27 - "auth.controller.ts"
Cohesion: 0.17
Nodes (16): CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema, registerSchema (+8 more)

### Community 29 - "keys.e2e-spec.ts"
Cohesion: 0.33
Nodes (6): KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, passphraseUpdate(), registered()

### Community 31 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 32 - "app.module.ts"
Cohesion: 0.05
Nodes (28): @nestjs/swagger@^12.1.2, AccountsModule, AppModule, BudgetsModule, CategoriesController, CategoriesModule, CurrenciesModule, DebtsModule (+20 more)

### Community 34 - "deposits.ts"
Cohesion: 0.05
Nodes (47): base64Bytes(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg (+39 more)

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.13
Nodes (7): @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.08
Nodes (13): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+5 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.09
Nodes (13): isoDate, RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput (+5 more)

### Community 42 - "receipts.controller.ts"
Cohesion: 0.07
Nodes (8): extractMessages(), WhatsappWebhookController, fmt(), ReceiptJob, ReceiptsProcessor, linkKey(), WhatsappClient, TestWhatsapp

### Community 43 - "home.ts"
Cohesion: 0.11
Nodes (21): Method, RequestBody, CreateAccount, CreateTransactions, isNetworkError(), OfflineCacheService, Installment, PlanDto (+13 more)

### Community 45 - "@angular/core"
Cohesion: 0.06
Nodes (36): routes, authInterceptor(), AUTO_LOCK_OPTIONS, WrongPassphraseError, DATE_PROVIDERS, TranslocoHttpLoader, SelectivePreloading, ThemePreference (+28 more)

### Community 46 - "App"
Cohesion: 0.25
Nodes (4): @angular/platform-browser@^22.3.0, App, appConfig, @angular/platform-browser

### Community 47 - "decimal.ts"
Cohesion: 0.06
Nodes (41): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB, USD (+33 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "installments/installments.service.ts"
Cohesion: 0.13
Nodes (6): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, InstallmentsService, toDto()

### Community 52 - "features/accounts/accounts.service.ts"
Cohesion: 0.09
Nodes (16): AccountDialog, CARD_NETWORKS, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon(), AccountPayload (+8 more)

### Community 53 - "WhatsappClient"
Cohesion: 0.11
Nodes (3): HouseholdRatesController, HouseholdRatesService, PublicRatesController

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "debts-page.ts"
Cohesion: 0.10
Nodes (31): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), HouseholdContextService, formatMoney(), isNegative() (+23 more)

### Community 57 - "AccountService"
Cohesion: 0.16
Nodes (5): AccountService, deviceLabel(), sha256(), TTL, Recipient

### Community 58 - "PrismaService"
Cohesion: 0.13
Nodes (4): CurrenciesController, PrismaService, cookieOf(), register()

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 60 - "account.controller.ts"
Cohesion: 0.19
Nodes (16): RESEND, STRICT, ChangeEmailInput, changeEmailSchema, ChangePasswordInput, changePasswordSchema, DeleteAccountInput, deleteAccountSchema (+8 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.08
Nodes (19): expense(), newDebt(), createAccount(), mailLink(), nextIn(), pick(), readPhrase(), registerViaUi() (+11 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - ".require"
Cohesion: 0.09
Nodes (14): deleteQuerySchema, DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields (+6 more)

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 71 - "backend/package.json"
Cohesion: 0.06
Nodes (46): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+38 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.07
Nodes (21): toIsoDate(), compareDecimals(), parseDecimalInput(), decimal(), amount(), fractionToPercent(), percentToFraction(), shiftPoint() (+13 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "goal-dialog.ts"
Cohesion: 0.11
Nodes (6): toInputValue(), BudgetDialog, GoalDialog, positive(), GoalKind, TransactionDialog

### Community 76 - "home.ts"
Cohesion: 0.20
Nodes (3): AppNotification, NotificationDto, NotificationsService

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "key-vault.service.ts"
Cohesion: 0.10
Nodes (39): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, keyFingerprint(), generateIdentity() (+31 more)

### Community 79 - "receipts.controller.ts"
Cohesion: 0.14
Nodes (14): AuthModule, ExtractorService, GENERIC_CATEGORIES, money, ReceiptExtraction, receiptExtractionSchema, IncomingMessage, linkSchema (+6 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.10, prisma@7.10.1, dotenv, prisma

### Community 84 - "tools-math.ts"
Cohesion: 0.20
Nodes (16): CardPayoff, cardPayoff(), CardPayoffInput, compoundGrowth(), CompoundInput, CompoundYear, DebitAccountInput, debitAnnualCost() (+8 more)

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 88 - "rates.e2e-spec.ts"
Cohesion: 0.50
Nodes (3): PublicRate, FakeSources, user()

### Community 92 - "savings.e2e-spec.ts"
Cohesion: 0.83
Nodes (3): linked(), payload(), setup()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "keys.service.ts"
Cohesion: 0.12
Nodes (7): verifyEd25519(), AppMailModule, UpdateKeysInput, updateKeysSchema, KeysService, MeController, UsersModule

### Community 97 - "production"
Cohesion: 0.50
Nodes (4): production, name, needs, runs-on

### Community 98 - "Operación"
Cohesion: 0.25
Nodes (8): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests, Íconos

### Community 99 - "services"
Cohesion: 0.10
Nodes (19): image, ports, profiles, restart, name, build, ports, profiles (+11 more)

### Community 100 - "KeyVaultService"
Cohesion: 0.12
Nodes (17): MeResponse, Identity, KeyVaultService, WrongRecoveryPhraseError, b64(), cleanupOrphans(), db(), forgetIdentity() (+9 more)

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 102 - "card-cycle.ts"
Cohesion: 0.09
Nodes (25): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+17 more)

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 105 - "notifications.module.ts"
Cohesion: 0.10
Nodes (7): NotificationsModule, RemindersProcessor, RemindersScheduler, PushService, DueReminder, RemindersService, bullmq

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 108 - "home.ts"
Cohesion: 0.07
Nodes (22): NAV, NavItem, HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, authGuard() (+14 more)

### Community 111 - "backup.sh"
Cohesion: 0.83
Nodes (3): backup.sh script, token(), upload()

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - ".require"
Cohesion: 0.13
Nodes (9): toBase64(), toIsoDate(), DepositsService, dto(), dto(), assetDto(), priceDto(), tradeDto() (+1 more)

### Community 114 - "scan.mjs"
Cohesion: 0.29
Nodes (4): files(), manifestPath, root, usedIcons()

### Community 125 - "ci.yml"
Cohesion: 0.17
Nodes (11): concurrency, cancel-in-progress, group, jobs, name, on, pull_request, push (+3 more)

### Community 127 - "Arquitectura"
Cohesion: 0.33
Nodes (6): Arquitectura, Backend: módulos, Componentes y despliegue, Decisiones clave, Frontend: áreas, Modelo de datos (simplificado)

### Community 128 - "Flujos principales"
Cohesion: 0.25
Nodes (8): Factura por WhatsApp, Flujos principales, Guardar un movimiento, Ingreso y desbloqueo, Olvidé mi contraseña de ingreso, Recordatorios y Web Push, Sincronización y modo sin conexión, Verificación de correo y bienvenida

### Community 130 - "Variables de entorno"
Cohesion: 0.33
Nodes (6): Base, Correo, Facturas por WhatsApp, OCR e IA, Notificaciones push, Operación interna, Variables de entorno

### Community 135 - "deploy.yml"
Cohesion: 0.18
Nodes (10): concurrency, cancel-in-progress, group, env, IMAGE_TAG, jobs, name, permissions (+2 more)

### Community 136 - "with"
Cohesion: 0.29
Nodes (11): steps, steps, steps, name, run, uses, with, client-id (+3 more)

### Community 137 - "env"
Cohesion: 0.15
Nodes (13): ACR_NAME, ANTHROPIC_API_KEY, BACKUP_AGE_RECIPIENT, DB_PASSWORD, JWT_SECRET, PARAMS, PG_ADMIN_PASSWORD, RG (+5 more)

### Community 138 - "Despliegue en Azure"
Cohesion: 0.20
Nodes (10): Arquitectura, Bajo demanda: qué implica, CI/CD (GitHub Actions), Configuración en GitHub (Settings → Environments), Costo estimado (precios públicos de North Central US), Despliegue en Azure, Detalles de producción, Dominios (+2 more)

### Community 139 - "backend"
Cohesion: 0.25
Nodes (8): env, name, runs-on, AUTH_RATE_LIMIT, DATABASE_URL, JWT_SECRET, REDIS_URL, backend

### Community 140 - "steps"
Cohesion: 0.32
Nodes (8): steps, steps, steps, if, name, run, uses, working-directory

### Community 142 - "postgres"
Cohesion: 0.25
Nodes (8): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, env, image, options, ports, postgres

### Community 143 - "with"
Cohesion: 0.25
Nodes (8): with, cache, cache-dependency-path, name, node-version, package_json_file, path, retention-days

### Community 144 - "staging"
Cohesion: 0.29
Nodes (8): name, url, staging, environment, environment, name, needs, runs-on

### Community 147 - "frontend"
Cohesion: 0.29
Nodes (7): defaults, run, defaults, name, runs-on, frontend, working-directory

### Community 148 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 149 - "workflow_run"
Cohesion: 0.33
Nodes (6): on, workflow_dispatch, workflow_run, branches, types, workflows

### Community 151 - "redis"
Cohesion: 0.40
Nodes (5): services, image, options, ports, redis

### Community 152 - "build"
Cohesion: 0.40
Nodes (5): environment, if, name, runs-on, build

### Community 155 - "e2e"
Cohesion: 0.50
Nodes (4): name, needs, runs-on, e2e

## Knowledge Gaps
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `app.module.ts` to `members.ts`, `dependencies`, `status.service.ts`, `accounts.schemas.ts`, `Env`, `test/helpers.ts`, `frontend/package.json`, `status.service.ts`, `auth.controller.ts`, `keys.e2e-spec.ts`, `deposits.ts`, `health.controller.ts`, `budgets/budgets.service.ts`, `recurring.schemas.ts`, `installments/installments.service.ts`, `AccountService`, `PrismaService`, `src/transactions/transactions.service.ts`, `account.controller.ts`, `.require`, `backend/package.json`, `receipts.controller.ts`, `rates.e2e-spec.ts`, `savings.e2e-spec.ts`, `keys.service.ts`, `notifications.module.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.05844155844155844 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `SavingsService`, `articles.ts`, `parseDecimalInput`, `goal-dialog.ts`, `home.ts`, `home.ts`, `dependencies`, `key-vault.service.ts`, `home.ts`, `debit-card-page.ts`, `features/accounts/accounts.service.ts`, `debts-page.ts`, `frontend/package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `members.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._