# Graph Report - commit  (2026-11-26)

## Corpus Check
- 330 files · ~150,492 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 48 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2702 nodes · 6799 edges · 133 communities (87 shown, 46 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 185 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d7d53e18`
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
- tools-math.ts
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
- frontend-dev
- TransactionsPage
- PrismaService
- deposits.ts
- ReceiptsService
- rate-sources.ts
- RatesService
- pick
- households.module.ts
- ProgressController
- members.ts
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
- debts-page.ts
- nest-cli.dev.json
- scripts
- .require
- frontend/package.json
- .receive
- TransactionDialog
- redis
- BudgetPage
- InstallmentsService
- core/auth/auth.service.ts
- PushService
- src/transactions/transactions.service.ts
- progress-engine.ts
- recurring-page.ts
- volumes
- e2e/helpers.ts
- backend/README.md
- Converter
- app.routes.ts
- debts.controller.ts
- Commit 🐷
- MembersService
- session-keys.ts
- plan.e2e.ts
- parseDecimalInput
- app.py
- budget-math.ts
- HouseholdService
- RatesService
- HouseholdPage
- key-vault.service.ts
- backend/package.json
- ReceiptsService
- ngsw-config.json
- features/accounts/accounts.service.ts
- Recover
- Register
- Facturas por WhatsApp
- PrismaModule
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
- KeyVaultService
- .oxlintrc.json
- currencies.controller.ts
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- ProgressService
- oxlint@^1.58.0
- StatusPage
- @angular/material
- SubscriptionPage
- allowBuilds
- source-map-support@^0.5.21
- @types/node@^24.0.0
- FakePush
- @types/pg@^8.23.1
- vitest@^4.1.2
- Arquitectura
- Flujos principales
- Variables de entorno
- TestWhatsapp
- @nestjs/cli@^12.0.0
- @nestjs/mau@^0.2.6
- @nestjs/schematics@^12.0.0
- openapi.ts
- @types/express@^5.0.0
- @types/web-push@^3.6.4
- vite@^8.0.0

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
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `TransactionDialog` --references--> `LedgerEntry`  [EXTRACTED]
  frontend/src/app/features/transactions/transaction-dialog/transaction-dialog.ts → frontend/src/app/features/transactions/transaction.model.ts
- `BudgetDialog` --references--> `BudgetMethod`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/features/budget/budget.model.ts

## Import Cycles
- None detected.

## Communities (133 total, 46 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.07
Nodes (16): TradeDialog, Asset, AssetClass, Contribution, Deposit, DepositPayload, Goal, GoalDraft (+8 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2 (+13 more)

### Community 4 - "backend/package.json"
Cohesion: 0.13
Nodes (15): devDependencies, @nestjs/testing@^12.0.1, oxlint-tsgolint@^7.0.2001, prettier@^3.4.2, supertest@^7.0.0, @types/cookie-parser@^1.4.10, @types/supertest@^7.0.0, typescript@^6.0.2 (+7 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.11
Nodes (9): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, RedisModule, redis (+1 more)

### Community 7 - "@nestjs/authentication"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 8 - "AccountsService"
Cohesion: 0.07
Nodes (19): AccountsController, uuid, AccountsModule, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage (+11 more)

### Community 9 - "tools-math.ts"
Cohesion: 0.20
Nodes (16): CardPayoff, cardPayoff(), CardPayoffInput, compoundGrowth(), CompoundInput, CompoundYear, DebitAccountInput, debitAnnualCost() (+8 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.12
Nodes (30): DueReminder, PrismaService, PublicRate, newUser(), payload(), payload(), setup(), payload() (+22 more)

### Community 12 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+19 more)

### Community 13 - "DebtsService"
Cohesion: 0.05
Nodes (33): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+25 more)

### Community 14 - "status.service.ts"
Cohesion: 0.13
Nodes (7): service, StatusController, StatusModule, NodeState, probe(), StatusNode, StatusService

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (21): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+13 more)

### Community 18 - "@angular/forms"
Cohesion: 0.09
Nodes (21): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+13 more)

### Community 20 - "backend-dev"
Cohesion: 0.12
Nodes (16): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+8 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.20
Nodes (26): environment, environment, ANTHROPIC_API_KEY, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, EXTRACTION_MODEL, JWT_SECRET (+18 more)

### Community 23 - "x-backend-env"
Cohesion: 0.10
Nodes (21): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, EXTRACTION_MODEL, JWT_SECRET, OCR_URL, PHONE_HASH_KEY, PORT (+13 more)

### Community 24 - "frontend-dev"
Cohesion: 0.19
Nodes (14): build, build, context, target, API_PROXY_TARGET, build, build, depends_on (+6 more)

### Community 25 - "TransactionsPage"
Cohesion: 0.15
Nodes (3): LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "PrismaService"
Cohesion: 0.07
Nodes (28): Env, envSchema, app, config, NotificationsModule, ExtractorService, OcrClient, GENERIC_CATEGORIES (+20 more)

### Community 27 - "deposits.ts"
Cohesion: 0.05
Nodes (46): base64Bytes(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, isoDate, collectDeposit, createDeposit (+38 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.10
Nodes (3): ReceiptsController, linkKey(), ReceiptsService

### Community 29 - "rate-sources.ts"
Cohesion: 0.05
Nodes (17): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), RateSources (+9 more)

### Community 31 - "pick"
Cohesion: 0.17
Nodes (6): expense(), newDebt(), pick(), expense(), newRule(), newTransaction()

### Community 32 - "households.module.ts"
Cohesion: 0.08
Nodes (10): BudgetsModule, CategoriesController, CategoriesModule, DebtsModule, HouseholdAccess, HouseholdAccessService, HouseholdsModule, InstallmentsModule (+2 more)

### Community 34 - "members.ts"
Cohesion: 0.18
Nodes (10): @nestjs/throttler@^6.8.0, accept, defaultHousehold, grant, invite, role, rotate, uuid (+2 more)

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.13
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.08
Nodes (13): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+5 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.10
Nodes (12): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+4 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.17
Nodes (3): InstallmentsController, CreatePlanInput, InstallmentsService

### Community 43 - "progress.service.ts"
Cohesion: 0.11
Nodes (23): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdContextService, OfflineCacheService, CRYPTO, NetWorthService (+15 more)

### Community 45 - "@angular/core"
Cohesion: 0.05
Nodes (27): App, appConfig, NAV, NavItem, authInterceptor(), AUTO_LOCK_OPTIONS, AutoLockService, TranslocoHttpLoader (+19 more)

### Community 46 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, rxjs, license (+7 more)

### Community 47 - "debts-page.ts"
Cohesion: 0.07
Nodes (18): CurrenciesService, Currency, formatMoney(), BudgetDialog, BudgetDialogData, optionalAmount(), toMoney(), ScheduleDialog (+10 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - ".require"
Cohesion: 0.14
Nodes (11): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), toDto(), assetDto(), priceDto() (+3 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "InstallmentsService"
Cohesion: 0.11
Nodes (22): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+14 more)

### Community 57 - "core/auth/auth.service.ts"
Cohesion: 0.17
Nodes (6): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, isNetworkError()

### Community 58 - "PushService"
Cohesion: 0.18
Nodes (3): RemindersProcessor, PushService, RemindersService

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 60 - "progress-engine.ts"
Cohesion: 0.19
Nodes (14): Article, Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, ARTICLES (+6 more)

### Community 62 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.13
Nodes (9): createAccount(), nextIn(), readPhrase(), registerViaUi(), strip(), unlock(), safeDay, receipt (+1 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 66 - "app.routes.ts"
Cohesion: 0.15
Nodes (12): routes, authGuard(), guestGuard(), landingGuard(), remember(), unlockedGuard(), DATE_PROVIDERS, EsArDateAdapter (+4 more)

### Community 67 - "debts.controller.ts"
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.28
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.07
Nodes (27): compareDecimals(), isNegative(), normalize(), parseDecimalInput(), stripThousands(), THOUSANDS, toInputValue(), ZERO (+19 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "budget-math.ts"
Cohesion: 0.05
Nodes (53): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB, USD (+45 more)

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "key-vault.service.ts"
Cohesion: 0.09
Nodes (45): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF (+37 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "features/accounts/accounts.service.ts"
Cohesion: 0.09
Nodes (15): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon() (+7 more)

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 89 - "savings-page.ts"
Cohesion: 0.11
Nodes (16): fromIsoDate(), monthOf(), todayIso(), toIsoDate(), NUMBER_LOCALE, CategoriesService, CategoryDto, RuleDialog (+8 more)

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
Nodes (19): AuthModule, AuthService, JwtAuth, memberKeySignedMessage(), verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed() (+11 more)

### Community 98 - "Operación"
Cohesion: 0.29
Nodes (7): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests

### Community 99 - "services"
Cohesion: 0.18
Nodes (10): profiles, restart, name, build, ports, profiles, restart, services (+2 more)

### Community 100 - "KeyVaultService"
Cohesion: 0.16
Nodes (6): MeResponse, Identity, KeyVaultService, WrongRecoveryPhraseError, fromBase64(), SessionService

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

### Community 110 - "@angular/material"
Cohesion: 0.11
Nodes (16): takeReturnUrl(), WrongPassphraseError, Login, CURRENCIES, Unlock, Box, BOXES, EDGES (+8 more)

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 127 - "Arquitectura"
Cohesion: 0.33
Nodes (6): Arquitectura, Backend: módulos, Componentes y despliegue, Decisiones clave, Frontend: áreas, Modelo de datos (simplificado)

### Community 128 - "Flujos principales"
Cohesion: 0.33
Nodes (6): Factura por WhatsApp, Flujos principales, Guardar un movimiento, Ingreso y desbloqueo, Recordatorios y Web Push, Sincronización y modo sin conexión

### Community 130 - "Variables de entorno"
Cohesion: 0.40
Nodes (5): Base, Facturas por WhatsApp, OCR e IA, Notificaciones push, Operación interna, Variables de entorno

### Community 137 - "openapi.ts"
Cohesion: 0.20
Nodes (6): @nestjs/swagger@^12.1.2, AppModule, document, out, @nestjs/swagger, @nestjs/testing

## Knowledge Gaps
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `test/helpers.ts` to `dependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `AccountsService`, `openapi.ts`, `status.service.ts`, `PrismaService`, `deposits.ts`, `rate-sources.ts`, `households.module.ts`, `members.ts`, `health.controller.ts`, `budgets/budgets.service.ts`, `recurring.schemas.ts`, `backend/package.json`, `.require`, `src/transactions/transactions.service.ts`, `debts.controller.ts`, `base64.ts`, `currencies.controller.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.0701344243132671 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `savings-page.ts`, `app.routes.ts`, `parseDecimalInput`, `progress.service.ts`, `dependencies`, `key-vault.service.ts`, `debts-page.ts`, `@angular/material`, `features/accounts/accounts.service.ts`, `frontend/package.json`, `@angular/forms`, `InstallmentsService`, `core/auth/auth.service.ts`, `progress-engine.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `plan.e2e.ts`, `pick`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._