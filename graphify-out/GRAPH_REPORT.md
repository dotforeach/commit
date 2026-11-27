# Graph Report - commit  (2026-11-27)

## Corpus Check
- 349 files · ~164,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 50 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2883 nodes · 7259 edges · 146 communities (96 shown, 50 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11faaaf0`
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
- app.routes.ts
- compilerOptions
- test/helpers.ts
- dependencies
- Debt
- frontend/package.json
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- tools-math.ts
- TransactionsService
- backend-dev
- frontend
- environment
- x-backend-env
- frontend-dev
- TransactionsPage
- src/receipts/receipts.service.ts
- auth.controller.ts
- ReceiptsService
- rates.controller.ts
- RatesService
- progress-engine.ts
- app.module.ts
- ProgressController
- deposits.ts
- recommend.ts
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- @angular/core
- InvestmentsService
- @angular/material
- getSodium
- decimal.ts
- nest-cli.dev.json
- scripts
- .require
- .deleteAccount
- Account
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
- session-keys.ts
- devDependencies
- parseDecimalInput
- app.py
- BudgetsService
- HouseholdService
- home.ts
- HouseholdPage
- key-vault.service.ts
- backend/package.json
- features/receipts/receipts.service.ts
- ngsw-config.json
- key-vault.service.ts
- Recover
- src/transactions/transactions.service.ts
- Register
- Facturas por WhatsApp
- pick
- savings-page.ts
- AccountService
- accounts.schemas.ts
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
- crypto.spec.ts
- scan.mjs
- app.config.ts
- RatesScheduler
- PlanPage
- CreditCardPage
- AutoLockService
- Login
- SettingsPage
- ProgressService
- .get
- api-contract.ts
- Arquitectura
- Flujos principales
- Variables de entorno
- ForgotPasswordPage
- AccountDialog
- VerifyEmailPage
- dotenv
- plan.e2e.ts
- Unlock
- tools-page.ts
- sync.spec.ts
- App
- version.ts
- source-map-support@^0.5.21
- @types/node@^24.0.0
- vite@^8.0.0
- @vitest/coverage-v8@^4.1.2

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 90 edges
2. `@nestjs/common` - 88 edges
3. `PrismaService` - 74 edges
4. `parseDecimalInput()` - 57 edges
5. `@angular/material` - 57 edges
6. `@jsverse/transloco` - 57 edges
7. `@angular/common` - 49 edges
8. `@angular/router` - 47 edges
9. `KeyVaultService` - 46 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `Debt` --references--> `Amortization`  [EXTRACTED]
  frontend/src/app/features/debts/debt.model.ts → frontend/src/app/features/debts/debt-math.ts
- `BudgetContext` --references--> `Budget`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/budget/budget.model.ts
- `BudgetContext` --references--> `Transaction`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/transactions/transaction.model.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts

## Import Cycles
- None detected.

## Communities (146 total, 50 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.07
Nodes (16): TradeDialog, Asset, AssetClass, Contribution, Deposit, DepositPayload, Goal, GoalDraft (+8 more)

### Community 1 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, api:types, build, e2e, icons:check, icons:subset, ng, start (+2 more)

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "members.ts"
Cohesion: 0.09
Nodes (15): memberKeySignedMessage(), verifyEd25519(), accept, defaultHousehold, grant, invite, role, rotate (+7 more)

### Community 4 - "dependencies"
Cohesion: 0.06
Nodes (33): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2 (+25 more)

### Community 6 - "status.service.ts"
Cohesion: 0.22
Nodes (4): familyRevokedKey(), RedisRefreshTokenStore, tokenKey(), userFamiliesKey()

### Community 7 - "articles.ts"
Cohesion: 0.10
Nodes (22): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+14 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (4): AccountsController, CreateAccountInput, AccountsService, toDto()

### Community 9 - "app.routes.ts"
Cohesion: 0.11
Nodes (17): authGuard(), guestGuard(), landingGuard(), remember(), unlockedGuard(), DATE_PROVIDERS, EsArDateAdapter, DEBTS_ROUTES (+9 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.14
Nodes (27): cookieOf(), register(), newUser(), payload(), payload(), setup(), payload(), setup() (+19 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (23): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0 (+15 more)

### Community 13 - "Debt"
Cohesion: 0.12
Nodes (4): Debt, DebtDraft, DebtsPage, DebtsService

### Community 14 - "frontend/package.json"
Cohesion: 0.15
Nodes (10): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+2 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "tools-math.ts"
Cohesion: 0.08
Nodes (34): ACODECO_MAY_2026, BankRate, CARD_RATES, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE, SBP_JULY_2026 (+26 more)

### Community 19 - "TransactionsService"
Cohesion: 0.11
Nodes (17): negateDecimal(), AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount() (+9 more)

### Community 20 - "backend-dev"
Cohesion: 0.10
Nodes (26): build, depends_on, build, depends_on, ports, profiles, volumes, profiles (+18 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.17
Nodes (30): environment, environment, ANTHROPIC_API_KEY, APP_URL, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, EXTRACTION_MODEL (+22 more)

### Community 23 - "x-backend-env"
Cohesion: 0.08
Nodes (24): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, EXTRACTION_MODEL, JWT_SECRET, MAIL_FROM, OCR_URL, PHONE_HASH_KEY (+16 more)

### Community 24 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "src/receipts/receipts.service.ts"
Cohesion: 0.05
Nodes (42): TTL, AuthModule, JwtAuth, StoredRecord, Env, AppMailModule, DisabledMailTransport, Recipient (+34 more)

### Community 27 - "auth.controller.ts"
Cohesion: 0.16
Nodes (17): CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema, RegisterInput (+9 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.06
Nodes (5): ReceiptsController, fmt(), ReceiptsProcessor, linkKey(), ReceiptsService

### Community 29 - "rates.controller.ts"
Cohesion: 0.16
Nodes (4): PublicRatesController, RatesProcessor, RatesService, ratesToday()

### Community 31 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 32 - "app.module.ts"
Cohesion: 0.06
Nodes (20): AccountsModule, BudgetsModule, CategoriesModule, envSchema, DebtsModule, DepositsModule, GoalsModule, HouseholdsModule (+12 more)

### Community 34 - "deposits.ts"
Cohesion: 0.05
Nodes (53): uuid, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema, base64Bytes() (+45 more)

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.13
Nodes (4): BudgetsController, CreateBudgetInput, BudgetsService, toDto()

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.10
Nodes (12): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+4 more)

### Community 43 - "@angular/core"
Cohesion: 0.08
Nodes (39): CurrenciesService, Currency, fromIsoDate(), monthOf(), HouseholdContextService, formatMoney(), toInputValue(), isNetworkError() (+31 more)

### Community 45 - "@angular/material"
Cohesion: 0.12
Nodes (16): NAV, NavItem, AUTO_LOCK_OPTIONS, WrongPassphraseError, SessionService, ResetPasswordPage, CURRENCIES, NotificationsBell (+8 more)

### Community 46 - "getSodium"
Cohesion: 0.21
Nodes (11): wipeIdentity(), KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR (+3 more)

### Community 47 - "decimal.ts"
Cohesion: 0.07
Nodes (33): addDecimals(), fromUnits(), isNegative(), normalize(), NUMBER_LOCALE, percentOf(), ratioOf(), BTC (+25 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - ".require"
Cohesion: 0.12
Nodes (11): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), GoalsService, toDto(), assetDto() (+3 more)

### Community 52 - "Account"
Cohesion: 0.15
Nodes (5): Account, AccountDraft, AccountsPage, AccountsService, toDraft()

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "debts-page.ts"
Cohesion: 0.07
Nodes (43): subDecimals(), shiftMonth(), estimateStatement(), card, plan, upcomingInstallments(), InstallmentPlan, amount() (+35 more)

### Community 57 - "AccountService"
Cohesion: 0.18
Nodes (4): AccountService, deviceLabel(), sha256(), AuthService

### Community 58 - "PrismaService"
Cohesion: 0.08
Nodes (8): AccountDto, AccountRow, Item, CategoriesController, HouseholdAccess, HouseholdAccessService, InstallmentsService, PrismaService

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.14
Nodes (4): SyncQuery, TransactionsController, toDto(), TransactionsService

### Community 60 - "account.controller.ts"
Cohesion: 0.19
Nodes (16): RESEND, STRICT, ChangeEmailInput, changeEmailSchema, ChangePasswordInput, changePasswordSchema, DeleteAccountInput, deleteAccountSchema (+8 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.12
Nodes (11): createAccount(), mailLink(), nextIn(), readPhrase(), registerViaUi(), strip(), unlock(), verifyEmail() (+3 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - ".require"
Cohesion: 0.11
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.14
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.33
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 71 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0, oxlint-tsgolint@^7.0.2001, prettier@^3.4.2 (+15 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.06
Nodes (26): todayIso(), toIsoDate(), compareDecimals(), parseDecimalInput(), decimal(), optionalAmount(), PaymentDialog, positive() (+18 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "BudgetsService"
Cohesion: 0.30
Nodes (3): Budget, BudgetDraft, BudgetsService

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "key-vault.service.ts"
Cohesion: 0.16
Nodes (13): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), keyFingerprint(), generateIdentity(), openPrivateKeys() (+5 more)

### Community 79 - "backend/package.json"
Cohesion: 0.09
Nodes (21): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, @types/express@^5.0.0, @types/supertest@^7.0.0 (+13 more)

### Community 80 - "features/receipts/receipts.service.ts"
Cohesion: 0.10
Nodes (5): HomeReceiptsCard, ReceiptsService, Subscription, WhatsappStatus, SubscriptionPage

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (15): HouseholdPayload, MeHousehold, RegisterRequest, RegistrationForm, RegistrationService, DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread() (+7 more)

### Community 84 - "src/transactions/transactions.service.ts"
Cohesion: 0.13
Nodes (15): syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema, fields, isTransfer(), legsMessage, transactionTypeSchema (+7 more)

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 88 - "pick"
Cohesion: 0.17
Nodes (6): expense(), newDebt(), pick(), expense(), newRule(), newTransaction()

### Community 89 - "savings-page.ts"
Cohesion: 0.13
Nodes (20): ZERO, CRYPTO, NetWorthService, DepositDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings() (+12 more)

### Community 91 - "accounts.schemas.ts"
Cohesion: 0.18
Nodes (12): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+4 more)

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
Nodes (6): KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, KeysService, MeController

### Community 98 - "Operación"
Cohesion: 0.25
Nodes (8): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests, Íconos

### Community 99 - "services"
Cohesion: 0.10
Nodes (19): image, ports, profiles, restart, name, build, ports, profiles (+11 more)

### Community 100 - "KeyVaultService"
Cohesion: 0.21
Nodes (3): MeResponse, Identity, KeyVaultService

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
Cohesion: 0.13
Nodes (4): NotificationsController, RemindersProcessor, PushService, RemindersService

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - "crypto.spec.ts"
Cohesion: 0.24
Nodes (12): FAST_KDF, generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), byFolded, fold(), generateRecoveryPhrase() (+4 more)

### Community 114 - "scan.mjs"
Cohesion: 0.29
Nodes (4): files(), manifestPath, root, usedIcons()

### Community 115 - "app.config.ts"
Cohesion: 0.14
Nodes (9): @angular/platform-browser@^22.3.0, @angular/service-worker@^22.3.0, appConfig, routes, authInterceptor(), TranslocoHttpLoader, SelectivePreloading, @angular/platform-browser (+1 more)

### Community 126 - "api-contract.ts"
Cohesion: 0.33
Nodes (4): Method, RequestBody, CreateAccount, CreateTransactions

### Community 127 - "Arquitectura"
Cohesion: 0.33
Nodes (6): Arquitectura, Backend: módulos, Componentes y despliegue, Decisiones clave, Frontend: áreas, Modelo de datos (simplificado)

### Community 128 - "Flujos principales"
Cohesion: 0.25
Nodes (8): Factura por WhatsApp, Flujos principales, Guardar un movimiento, Ingreso y desbloqueo, Olvidé mi contraseña de ingreso, Recordatorios y Web Push, Sincronización y modo sin conexión, Verificación de correo y bienvenida

### Community 130 - "Variables de entorno"
Cohesion: 0.33
Nodes (6): Base, Correo, Facturas por WhatsApp, OCR e IA, Notificaciones push, Operación interna, Variables de entorno

### Community 135 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.10, prisma@7.10.1, dotenv, prisma

### Community 138 - "tools-page.ts"
Cohesion: 0.40
Nodes (3): CHECKED_AT, TOOLS, ToolsPage

## Knowledge Gaps
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `src/receipts/receipts.service.ts` to `app.module.ts`, `keys.service.ts`, `deposits.ts`, `members.ts`, `dependencies`, `.require`, `health.controller.ts`, `auth.controller.ts`, `recurring.schemas.ts`, `test/helpers.ts`, `frontend/package.json`, `backend/package.json`, `currencies.controller.ts`, `src/transactions/transactions.service.ts`, `PrismaService`, `accounts.schemas.ts`, `account.controller.ts`, `rates.controller.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.07071887784921099 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `articles.ts`, `parseDecimalInput`, `app.routes.ts`, `tools-page.ts`, `dependencies`, `@angular/material`, `key-vault.service.ts`, `features/receipts/receipts.service.ts`, `key-vault.service.ts`, `app.config.ts`, `tools-math.ts`, `debts-page.ts`, `savings-page.ts`, `frontend/package.json`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `pick`, `plan.e2e.ts`, `frontend/package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `members.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09462365591397849 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.059743954480796585 - nodes in this community are weakly interconnected._