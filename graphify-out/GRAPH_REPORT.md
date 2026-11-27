# Graph Report - commit  (2026-11-26)

## Corpus Check
- 330 files · ~150,463 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 48 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2694 nodes · 6783 edges · 143 communities (90 shown, 53 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 185 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9162e737`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SavingsService
- scripts
- frontend
- dependencies
- backend/package.json
- auth.controller.ts
- redis-refresh-token.store.ts
- @nestjs/authentication
- AccountsService
- account.model.ts
- compilerOptions
- test/helpers.ts
- dependencies
- DebtsService
- status.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @angular/forms
- TransactionsService
- backend-dev
- frontend
- environment
- x-backend-env
- backend
- TransactionsPage
- PrismaService
- deposits.ts
- ReceiptsService
- rate-sources.ts
- RatesService
- EsArDateAdapter
- households.module.ts
- ProgressController
- .create
- recommend.ts
- DepositsService
- DepositsService
- health.controller.ts
- CurrentUser
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- progress.service.ts
- InvestmentsService
- @angular/core
- backend/package.json
- BudgetsService
- nest-cli.dev.json
- scripts
- .require
- frontend/package.json
- pick
- budgets/budgets.service.ts
- redis
- BudgetPage
- InstallmentsService
- home.ts
- PushService
- src/transactions/transactions.service.ts
- progress-engine.ts
- recurring-page.ts
- OnboardingPage
- e2e/helpers.ts
- backend/README.md
- Converter
- date-providers.ts
- debts.controller.ts
- Commit 🐷
- MembersService
- session-keys.ts
- sodium.ts
- parseDecimalInput
- app.py
- debts-page.ts
- HouseholdService
- RatesService
- HouseholdPage
- getSodium
- backend/package.json
- ReceiptsService
- ngsw-config.json
- Account
- default-categories.ts
- crypto.spec.ts
- Facturas por WhatsApp
- key-vault.service.ts
- savings-page.ts
- version.ts
- .require
- adminer
- AccountsPage
- Frontend
- base64.ts
- GoalsService
- Operación
- services
- fromBase64
- .oxlintrc.json
- currencies.controller.ts
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- ProgressService
- frontend-dev
- StatusPage
- Unlock
- SubscriptionPage
- allowBuilds
- backend
- AutoLockService
- FakePush
- WhatsappCard
- Login
- libsodium-wrappers-sumo
- SettingsPage
- ThemeService
- @types/cookie-parser@^1.4.10
- RatesPage
- vitest@^4.1.2
- RedisModule
- Arquitectura
- Flujos principales
- Variables de entorno
- TestWhatsapp
- ArticlePage
- @nestjs/cli@^12.0.0
- @nestjs/mau@^0.2.6
- @nestjs/schematics@^12.0.0
- @nestjs/testing
- @types/express@^5.0.0
- @types/web-push@^3.6.4
- typescript@^6.0.2
- vite@^8.0.0
- @fontsource/roboto@5.3.0

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 84 edges
2. `@nestjs/common` - 83 edges
3. `PrismaService` - 71 edges
4. `parseDecimalInput()` - 57 edges
5. `@angular/material` - 52 edges
6. `@jsverse/transloco` - 52 edges
7. `@angular/common` - 47 edges
8. `KeyVaultService` - 45 edges
9. `@angular/router` - 41 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `BudgetContext` --references--> `Transaction`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/transactions/transaction.model.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts
- `TestWhatsapp` --inherits--> `WhatsappClient`  [EXTRACTED]
  backend/test/receipts.e2e-spec.ts → backend/src/receipts/whatsapp.client.ts

## Import Cycles
- None detected.

## Communities (143 total, 53 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.11
Nodes (3): Deposit, Goal, SavingsPage

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.07
Nodes (26): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2 (+18 more)

### Community 4 - "backend/package.json"
Cohesion: 0.11
Nodes (18): devDependencies, oxlint@^1.58.0, oxlint-tsgolint@^7.0.2001, prettier@^3.4.2, source-map-support@^0.5.21, supertest@^7.0.0, @types/node@^24.0.0, @types/pg@^8.23.1 (+10 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (7): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), redis, ioredis

### Community 7 - "@nestjs/authentication"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 8 - "AccountsService"
Cohesion: 0.08
Nodes (17): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+9 more)

### Community 9 - "account.model.ts"
Cohesion: 0.18
Nodes (7): AccountDialog, ACCOUNT_TYPES, AccountDto, accountIcon(), AccountPayload, AccountType, CreditCardPayload

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.11
Nodes (29): memberKeySignedMessage(), PrismaModule, PrismaService, newUser(), payload(), payload(), setup(), payload() (+21 more)

### Community 12 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0 (+13 more)

### Community 13 - "DebtsService"
Cohesion: 0.06
Nodes (23): DebtDialog, Amortization, Debt, DebtDraft, DebtDto, DebtKind, DebtPayload, DebtPayment (+15 more)

### Community 14 - "status.service.ts"
Cohesion: 0.11
Nodes (8): REDIS, service, StatusController, StatusModule, NodeState, probe(), StatusNode, StatusService

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "@angular/forms"
Cohesion: 0.07
Nodes (35): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+27 more)

### Community 20 - "backend-dev"
Cohesion: 0.15
Nodes (13): depends_on, ports, profiles, volumes, postgres, redis, depends_on, profiles (+5 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.23
Nodes (22): environment, environment, ANTHROPIC_API_KEY, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV (+14 more)

### Community 23 - "x-backend-env"
Cohesion: 0.12
Nodes (17): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET, OCR_URL, PORT, REDIS_URL, STATUS_TOKEN (+9 more)

### Community 24 - "backend"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "PrismaService"
Cohesion: 0.06
Nodes (30): @nestjs/platform-express@^12.0.1, Env, envSchema, app, config, NotificationsModule, ExtractorService, OcrClient (+22 more)

### Community 27 - "deposits.ts"
Cohesion: 0.05
Nodes (54): base64Bytes(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, isoDate, collectDeposit, createDeposit (+46 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.10
Nodes (3): ReceiptsController, linkKey(), ReceiptsService

### Community 29 - "rate-sources.ts"
Cohesion: 0.08
Nodes (16): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+8 more)

### Community 32 - "households.module.ts"
Cohesion: 0.09
Nodes (9): AccountsModule, BudgetsModule, CategoriesController, CategoriesModule, DebtsModule, HouseholdsModule, InstallmentsModule, RecurringModule (+1 more)

### Community 34 - ".create"
Cohesion: 0.12
Nodes (3): HouseholdRatesController, HouseholdRatesService, PublicRatesController

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.13
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.08
Nodes (13): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+5 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.09
Nodes (13): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+5 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.13
Nodes (6): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, InstallmentsService, toDto()

### Community 43 - "progress.service.ts"
Cohesion: 0.09
Nodes (31): Method, RequestBody, CreateAccount, CreateTransactions, KeyVaultService, HouseholdContextService, ZERO, OfflineCacheService (+23 more)

### Community 45 - "@angular/core"
Cohesion: 0.06
Nodes (50): NAV, NavItem, routes, authInterceptor(), AUTO_LOCK_OPTIONS, CurrenciesService, Currency, monthOf() (+42 more)

### Community 46 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, rxjs, license (+7 more)

### Community 47 - "BudgetsService"
Cohesion: 0.10
Nodes (12): BudgetDialog, BudgetContext, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem (+4 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - ".require"
Cohesion: 0.14
Nodes (9): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), assetDto(), priceDto(), tradeDto() (+1 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 52 - "pick"
Cohesion: 0.33
Nodes (11): amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt (+3 more)

### Community 53 - "budgets/budgets.service.ts"
Cohesion: 0.29
Nodes (4): @angular/platform-browser@^22.3.0, App, appConfig, @angular/platform-browser

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "InstallmentsService"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 57 - "home.ts"
Cohesion: 0.10
Nodes (14): MeHousehold, RegisterRequest, TokenResponse, AuthService, authGuard(), guestGuard(), landingGuard(), remember() (+6 more)

### Community 58 - "PushService"
Cohesion: 0.16
Nodes (4): RemindersProcessor, PushService, DueReminder, RemindersService

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 60 - "progress-engine.ts"
Cohesion: 0.15
Nodes (17): Article, Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, articleBySlug() (+9 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.09
Nodes (17): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+9 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 66 - "date-providers.ts"
Cohesion: 0.29
Nodes (5): DATE_PROVIDERS, DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES, TRANSACTIONS_ROUTES

### Community 67 - "debts.controller.ts"
Cohesion: 0.10
Nodes (12): deleteQuerySchema, DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields (+4 more)

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.33
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 71 - "sodium.ts"
Cohesion: 0.33
Nodes (8): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8()

### Community 72 - "parseDecimalInput"
Cohesion: 0.08
Nodes (30): fromIsoDate(), todayIso(), toIsoDate(), compareDecimals(), parseDecimalInput(), stripThousands(), toInputValue(), decimal() (+22 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "debts-page.ts"
Cohesion: 0.10
Nodes (33): addDecimals(), fromUnits(), isNegative(), negateDecimal(), normalize(), percentOf(), ratioOf(), BTC (+25 more)

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "getSodium"
Cohesion: 0.17
Nodes (21): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF (+13 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "Account"
Cohesion: 0.16
Nodes (4): Account, AccountDraft, AccountsPage, toDraft()

### Community 86 - "crypto.spec.ts"
Cohesion: 0.15
Nodes (8): byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), Recover, Register, @scure/bip39

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 88 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (11): HouseholdPayload, keyFingerprint(), DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker(), pending, UpdateKeysRequest (+3 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.09
Nodes (33): NUMBER_LOCALE, AmountDialogData, AmountDialogResult, optional(), TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount() (+25 more)

### Community 92 - ".require"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "base64.ts"
Cohesion: 0.06
Nodes (18): AuthModule, AuthService, JwtAuth, verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR (+10 more)

### Community 98 - "Operación"
Cohesion: 0.29
Nodes (7): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests

### Community 99 - "services"
Cohesion: 0.13
Nodes (14): name, build, ports, profiles, restart, services, ocr, volumes (+6 more)

### Community 100 - "fromBase64"
Cohesion: 0.27
Nodes (3): MeResponse, Identity, fromBase64()

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 105 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.10, prisma@7.10.1, dotenv, prisma

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 108 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - "backend"
Cohesion: 0.33
Nodes (6): depends_on, profiles, restart, migrate, condition, backend

### Community 127 - "Arquitectura"
Cohesion: 0.33
Nodes (6): Arquitectura, Backend: módulos, Componentes y despliegue, Decisiones clave, Frontend: áreas, Modelo de datos (simplificado)

### Community 128 - "Flujos principales"
Cohesion: 0.33
Nodes (6): Factura por WhatsApp, Flujos principales, Guardar un movimiento, Ingreso y desbloqueo, Recordatorios y Web Push, Sincronización y modo sin conexión

### Community 130 - "Variables de entorno"
Cohesion: 0.40
Nodes (5): Base, Facturas por WhatsApp, OCR e IA, Notificaciones push, Operación interna, Variables de entorno

## Knowledge Gaps
- **53 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `test/helpers.ts` to `dependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `AccountsService`, `status.service.ts`, `PrismaService`, `deposits.ts`, `rate-sources.ts`, `households.module.ts`, `health.controller.ts`, `budgets/budgets.service.ts`, `recurring.schemas.ts`, `installments/installments.service.ts`, `backend/package.json`, `.require`, `PushService`, `src/transactions/transactions.service.ts`, `debts.controller.ts`, `base64.ts`, `currencies.controller.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `savings-page.ts`, `date-providers.ts`, `parseDecimalInput`, `progress.service.ts`, `dependencies`, `getSodium`, `@angular/forms`, `frontend/package.json`, `key-vault.service.ts`, `home.ts`, `progress-engine.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@jsverse/transloco` connect `@angular/core` to `savings-page.ts`, `parseDecimalInput`, `progress.service.ts`, `dependencies`, `getSodium`, `@angular/forms`, `frontend/package.json`, `home.ts`, `progress-engine.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._