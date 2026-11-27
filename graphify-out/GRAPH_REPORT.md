# Graph Report - commit  (2026-11-27)

## Corpus Check
- 356 files · ~166,883 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 55 file(s) not represented in the graph (top: .scss 26, (none) 15, .bicep 3)

## Summary
- 3019 nodes · 7407 edges · 170 communities (108 shown, 62 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cc93e3c7`
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
- date-providers.ts
- compilerOptions
- test/helpers.ts
- dependencies
- Debt
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
- Env
- auth.controller.ts
- ReceiptsService
- RatesService
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
- getSodium
- decimal.ts
- nest-cli.dev.json
- scripts
- toBase64
- .deleteAccount
- Account
- WhatsappClient
- redis
- BudgetPage
- debt-math.ts
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
- session-keys.ts
- backend/package.json
- parseDecimalInput
- app.py
- BudgetsService
- HouseholdService
- home.ts
- HouseholdPage
- key-vault.service.ts
- ExtractorService
- ReceiptsService
- ngsw-config.json
- key-vault.service.ts
- Recover
- tools-math.ts
- Register
- Facturas por WhatsApp
- .require
- savings-page.ts
- AccountService
- DebtsService
- .require
- adminer
- AccountsPage
- Frontend
- keys.service.ts
- PlanPage
- Operación
- services
- KeyVaultService
- .oxlintrc.json
- card-cycle.ts
- PlanService
- allowBuilds
- RemindersService
- nest-cli.json
- subset.py
- AuthService
- StatusPage
- AccountSecurityCard
- currencies.controller.ts
- allowBuilds
- DepositsService
- scan.mjs
- plan-engine.ts
- RatesScheduler
- PlanPage
- CreditCardPage
- AutoLockService
- Login
- SettingsPage
- ProgressService
- ci.yml
- debt.model.ts
- Arquitectura
- Flujos principales
- Variables de entorno
- ForgotPasswordPage
- account-dialog.ts
- VerifyEmailPage
- deploy.yml
- with
- env
- Despliegue en Azure
- backend
- steps
- version.ts
- postgres
- with
- production
- PaymentDialog
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
- staging
- FakePush
- libsodium-wrappers-sumo
- ResetPasswordPage
- ChangePassphrase
- ArticlePage
- HomeReceiptsCard
- CreditCardPage
- DebitCardPage
- MortgagePage
- smoke.sh
- bootstrap.sh
- deploy.sh
- domains.sh

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 90 edges
2. `@nestjs/common` - 88 edges
3. `PrismaService` - 74 edges
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
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts
- `dto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/deposits/deposits.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (170 total, 62 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, api:types, build, e2e, icons:check, icons:subset, ng, start (+2 more)

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "members.ts"
Cohesion: 0.11
Nodes (10): TTL, RegisterInput, AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect (+2 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, @anthropic-ai/sdk@^1.14.0, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1 (+31 more)

### Community 6 - "status.service.ts"
Cohesion: 0.22
Nodes (4): familyRevokedKey(), RedisRefreshTokenStore, tokenKey(), userFamiliesKey()

### Community 7 - "articles.ts"
Cohesion: 0.16
Nodes (16): Article, Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, ARTICLES (+8 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (18): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+10 more)

### Community 9 - "date-providers.ts"
Cohesion: 0.27
Nodes (5): DATE_PROVIDERS, DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES, TRANSACTIONS_ROUTES

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.11
Nodes (32): memberKeySignedMessage(), DueReminder, PublicRate, cookieOf(), register(), newUser(), payload(), payload() (+24 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+16 more)

### Community 13 - "Debt"
Cohesion: 0.16
Nodes (3): Debt, DebtPayload, DebtsPage

### Community 14 - "frontend/package.json"
Cohesion: 0.18
Nodes (8): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), RateSources

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "debit-card-page.ts"
Cohesion: 0.16
Nodes (16): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+8 more)

### Community 19 - "TransactionsService"
Cohesion: 0.18
Nodes (7): INFLOW_TYPES, Transaction, TransactionDto, TransactionType, Page, SingleDraft, TransactionsService

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
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "Env"
Cohesion: 0.08
Nodes (16): StoredRecord, Env, AppMailModule, DisabledMailTransport, REDIS, service, StatusController, NodeState (+8 more)

### Community 27 - "auth.controller.ts"
Cohesion: 0.14
Nodes (16): CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema, registerSchema (+8 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.10
Nodes (3): ReceiptsController, linkKey(), ReceiptsService

### Community 31 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 32 - "app.module.ts"
Cohesion: 0.05
Nodes (22): AccountsModule, BudgetsModule, CategoriesModule, envSchema, CurrenciesModule, DebtsModule, DepositsModule, GoalsModule (+14 more)

### Community 34 - "deposits.ts"
Cohesion: 0.05
Nodes (49): uuid, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, updateBudgetSchema, base64Bytes(), encryptedPayload (+41 more)

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.13
Nodes (4): BudgetsController, CreateBudgetInput, UpdateBudgetInput, BudgetsService

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.14
Nodes (4): RecurringController, CreateRuleInput, UpdateRuleInput, RecurringService

### Community 42 - "receipts.controller.ts"
Cohesion: 0.06
Nodes (16): bullmq@^6.7.10, AuthModule, extractMessages(), IncomingMessage, linkSchema, planSchema, WhatsappWebhookController, ReceiptsModule (+8 more)

### Community 43 - "home.ts"
Cohesion: 0.12
Nodes (23): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdContextService, isNetworkError(), OfflineCacheService, Installment (+15 more)

### Community 45 - "@angular/core"
Cohesion: 0.06
Nodes (49): App, appConfig, NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard() (+41 more)

### Community 46 - "getSodium"
Cohesion: 0.33
Nodes (8): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8()

### Community 47 - "decimal.ts"
Cohesion: 0.08
Nodes (42): addDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB (+34 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "toBase64"
Cohesion: 0.07
Nodes (23): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), InstallmentsController, uuid, CreatePlanInput (+15 more)

### Community 52 - "Account"
Cohesion: 0.16
Nodes (4): Account, AccountDraft, AccountsPage, toDraft()

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "debt-math.ts"
Cohesion: 0.26
Nodes (11): amortizationSchedule(), frenchPayment(), monthlyRate(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt, StrategyResult (+3 more)

### Community 57 - "AccountService"
Cohesion: 0.25
Nodes (3): AccountService, sha256(), Recipient

### Community 58 - "PrismaService"
Cohesion: 0.08
Nodes (14): Item, toDto(), CategoriesController, HouseholdAccess, HouseholdAccessService, accept, defaultHousehold, grant (+6 more)

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.08
Nodes (19): SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema, fields, isTransfer() (+11 more)

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
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.33
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 71 - "backend/package.json"
Cohesion: 0.05
Nodes (50): author, description, devDependencies, dotenv@^18.0.10, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1 (+42 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.06
Nodes (47): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), compareDecimals(), formatMoney() (+39 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "BudgetsService"
Cohesion: 0.10
Nodes (10): BudgetDialog, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto (+2 more)

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "key-vault.service.ts"
Cohesion: 0.16
Nodes (17): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, openPrivateKeys(), sealAad() (+9 more)

### Community 79 - "ExtractorService"
Cohesion: 0.12
Nodes (7): ExtractorService, OcrClient, GENERIC_CATEGORIES, money, ReceiptExtraction, receiptExtractionSchema, SealedReceipt

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "key-vault.service.ts"
Cohesion: 0.18
Nodes (20): RegistrationForm, RegistrationService, generateIdentity(), wipeIdentity(), DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker() (+12 more)

### Community 84 - "tools-math.ts"
Cohesion: 0.20
Nodes (16): CardPayoff, cardPayoff(), CardPayoffInput, compoundGrowth(), CompoundInput, CompoundYear, DebitAccountInput, debitAnnualCost() (+8 more)

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 89 - "savings-page.ts"
Cohesion: 0.14
Nodes (18): NUMBER_LOCALE, TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection (+10 more)

### Community 92 - ".require"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "keys.service.ts"
Cohesion: 0.12
Nodes (9): verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, updateKeysSchema, KeysService (+1 more)

### Community 98 - "Operación"
Cohesion: 0.25
Nodes (8): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests, Íconos

### Community 99 - "services"
Cohesion: 0.10
Nodes (19): image, ports, profiles, restart, name, build, ports, profiles (+11 more)

### Community 100 - "KeyVaultService"
Cohesion: 0.16
Nodes (5): MeResponse, Identity, KeyVaultService, WrongPassphraseError, WrongRecoveryPhraseError

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 102 - "card-cycle.ts"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 105 - "RemindersService"
Cohesion: 0.18
Nodes (3): RemindersProcessor, PushService, RemindersService

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 108 - "AuthService"
Cohesion: 0.15
Nodes (6): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, keyFingerprint()

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 114 - "scan.mjs"
Cohesion: 0.29
Nodes (4): files(), manifestPath, root, usedIcons()

### Community 115 - "plan-engine.ts"
Cohesion: 0.29
Nodes (7): buildPlan(), effectiveRate(), pick(), PlanDebt, PlanInput, PlanResult, round2()

### Community 125 - "ci.yml"
Cohesion: 0.17
Nodes (11): concurrency, cancel-in-progress, group, jobs, name, on, pull_request, push (+3 more)

### Community 126 - "debt.model.ts"
Cohesion: 0.25
Nodes (9): DebtDialog, Amortization, DebtDto, DebtKind, DebtPayment, DebtStatus, PaymentDraft, PaymentPayload (+1 more)

### Community 127 - "Arquitectura"
Cohesion: 0.33
Nodes (6): Arquitectura, Backend: módulos, Componentes y despliegue, Decisiones clave, Frontend: áreas, Modelo de datos (simplificado)

### Community 128 - "Flujos principales"
Cohesion: 0.25
Nodes (8): Factura por WhatsApp, Flujos principales, Guardar un movimiento, Ingreso y desbloqueo, Olvidé mi contraseña de ingreso, Recordatorios y Web Push, Sincronización y modo sin conexión, Verificación de correo y bienvenida

### Community 130 - "Variables de entorno"
Cohesion: 0.33
Nodes (6): Base, Correo, Facturas por WhatsApp, OCR e IA, Notificaciones push, Operación interna, Variables de entorno

### Community 132 - "account-dialog.ts"
Cohesion: 0.19
Nodes (8): AccountDialog, CARD_NETWORKS, decimal(), ACCOUNT_TYPES, AccountDto, AccountPayload, AccountType, CreditCardPayload

### Community 135 - "deploy.yml"
Cohesion: 0.18
Nodes (10): concurrency, cancel-in-progress, group, env, IMAGE_TAG, jobs, name, permissions (+2 more)

### Community 136 - "with"
Cohesion: 0.29
Nodes (11): steps, steps, steps, name, run, uses, with, client-id (+3 more)

### Community 137 - "env"
Cohesion: 0.18
Nodes (11): ACR_NAME, ANTHROPIC_API_KEY, JWT_SECRET, PARAMS, PG_ADMIN_PASSWORD, RG, SMTP_URL, STATUS_TOKEN (+3 more)

### Community 138 - "Despliegue en Azure"
Cohesion: 0.22
Nodes (8): Arquitectura, CI/CD (GitHub Actions), Configuración en GitHub (Settings → Environments), Costo estimado (precios públicos de North Central US), Despliegue en Azure, Detalles de producción, Dominios, Puesta en marcha (una sola vez)

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

### Community 144 - "production"
Cohesion: 0.29
Nodes (8): name, url, production, environment, name, needs, runs-on, environment

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

### Community 156 - "staging"
Cohesion: 0.50
Nodes (4): staging, name, needs, runs-on

## Knowledge Gaps
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `test/helpers.ts` to `app.module.ts`, `keys.service.ts`, `deposits.ts`, `members.ts`, `dependencies`, `PrismaService`, `.require`, `backend/package.json`, `accounts.schemas.ts`, `health.controller.ts`, `receipts.controller.ts`, `src/transactions/transactions.service.ts`, `frontend/package.json`, `toBase64`, `Env`, `auth.controller.ts`, `account.controller.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `account-dialog.ts`, `articles.ts`, `parseDecimalInput`, `date-providers.ts`, `home.ts`, `dependencies`, `AuthService`, `key-vault.service.ts`, `debit-card-page.ts`, `debt-math.ts`, `savings-page.ts`, `frontend/package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `members.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05204872646733112 - nodes in this community are weakly interconnected._