# Graph Report - commit  (2026-11-27)

## Corpus Check
- 335 files · ~156,134 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 50 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2727 nodes · 6827 edges · 130 communities (89 shown, 41 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 185 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b9ce7ec`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SavingsService
- scripts
- frontend
- dependencies
- backend/package.json
- auth.controller.ts
- RedisRefreshTokenStore
- progress-engine.ts
- deleteQuerySchema
- rule-dialog.ts
- compilerOptions
- test/helpers.ts
- dependencies
- DebtsService
- rate-sources.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @angular/forms
- zod
- backend-dev
- frontend
- environment
- x-backend-env
- frontend-dev
- TransactionsPage
- src/receipts/receipts.service.ts
- deposits.ts
- ReceiptsService
- rates.controller.ts
- rates-page.ts
- BudgetsService
- app.module.ts
- ProgressController
- zod
- recommend.ts
- DepositsService
- DepositsService
- health.controller.ts
- CurrentUser
- budgets/budgets.service.ts
- RecurringController
- installments/installments.service.ts
- progress.service.ts
- InvestmentsService
- @angular/core
- getSodium
- debts-page.ts
- nest-cli.dev.json
- scripts
- toBase64
- frontend/package.json
- Account
- HouseholdRatesService
- redis
- BudgetPage
- InstallmentsService
- .require
- PrismaService
- src/transactions/transactions.service.ts
- recurring.controller.ts
- recurring-page.ts
- volumes
- e2e/helpers.ts
- backend/README.md
- Converter
- EsArDateAdapter
- DebtsController
- Commit 🐷
- MembersService
- session-keys.ts
- ReceiptsService
- parseDecimalInput
- app.py
- BudgetsService
- HouseholdService
- RatesService
- HouseholdPage
- registration.service.ts
- getSodium
- ReceiptsService
- ngsw-config.json
- @angular/material
- Recover
- AccountsService
- Register
- Facturas por WhatsApp
- accounts.schemas.ts
- savings-page.ts
- version.ts
- GoalsService
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
- subset.py
- key-vault.service.ts
- StatusPage
- Unlock
- SubscriptionPage
- allowBuilds
- crypto.spec.ts
- scan.mjs
- App
- RedisModule
- AutoLockService
- ThemeService
- WhatsappCard
- Login
- SettingsPage
- Arquitectura
- Flujos principales
- Variables de entorno
- openapi.ts

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
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts
- `dto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/deposits/deposits.ts → backend/src/common/base64.ts
- `dto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/goals/goals.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (130 total, 41 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, api:types, build, e2e, icons:check, icons:subset, ng, start (+2 more)

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2 (+18 more)

### Community 4 - "backend/package.json"
Cohesion: 0.06
Nodes (44): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+36 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "RedisRefreshTokenStore"
Cohesion: 0.22
Nodes (4): familyRevokedKey(), RedisRefreshTokenStore, tokenKey(), userFamiliesKey()

### Community 7 - "progress-engine.ts"
Cohesion: 0.05
Nodes (41): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+33 more)

### Community 8 - "deleteQuerySchema"
Cohesion: 0.17
Nodes (3): AccountsController, deleteQuerySchema, listQuerySchema

### Community 9 - "rule-dialog.ts"
Cohesion: 0.16
Nodes (7): Frequency, PendingList, PendingOccurrence, RuleDto, RulePayload, positiveAmount(), RuleDialog

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.09
Nodes (33): AppModule, memberKeySignedMessage(), verifyEd25519(), extractMessages(), newUser(), payload(), payload(), setup() (+25 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0 (+16 more)

### Community 13 - "DebtsService"
Cohesion: 0.06
Nodes (25): DebtDialog, Amortization, monthlyRate(), simulatePayoff(), Debt, DebtDraft, DebtDto, DebtKind (+17 more)

### Community 14 - "rate-sources.ts"
Cohesion: 0.15
Nodes (10): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+2 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.10
Nodes (16): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+8 more)

### Community 18 - "@angular/forms"
Cohesion: 0.07
Nodes (35): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+27 more)

### Community 19 - "zod"
Cohesion: 0.13
Nodes (10): AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount(), INFLOW_TYPES (+2 more)

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
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "src/receipts/receipts.service.ts"
Cohesion: 0.05
Nodes (38): StoredRecord, Env, app, config, NotificationsModule, ExtractorService, OcrClient, GENERIC_CATEGORIES (+30 more)

### Community 27 - "deposits.ts"
Cohesion: 0.08
Nodes (22): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule (+14 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.08
Nodes (3): ReceiptsController, linkKey(), ReceiptsService

### Community 29 - "rates.controller.ts"
Cohesion: 0.10
Nodes (12): createManual, HouseholdRatesController, PublicRatesController, settings, USD_RATE_TYPES, uuid, RatesModule, RATES_QUEUE (+4 more)

### Community 31 - "BudgetsService"
Cohesion: 0.17
Nodes (6): expense(), newDebt(), pick(), expense(), newRule(), newTransaction()

### Community 32 - "app.module.ts"
Cohesion: 0.06
Nodes (20): AccountsModule, AuthModule, BudgetsModule, CategoriesModule, envSchema, DebtsModule, createContribution, createGoal (+12 more)

### Community 34 - "zod"
Cohesion: 0.06
Nodes (46): uuid, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, updateBudgetSchema, base64Bytes(), isoDate (+38 more)

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
Nodes (5): BudgetsController, CreateBudgetInput, UpdateBudgetInput, BudgetsService, toDto()

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.18
Nodes (3): InstallmentsController, CreatePlanInput, InstallmentsService

### Community 43 - "progress.service.ts"
Cohesion: 0.09
Nodes (27): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, KeyVaultService, isNetworkError() (+19 more)

### Community 45 - "@angular/core"
Cohesion: 0.05
Nodes (44): NAV, NavItem, routes, RegisterRequest, TokenResponse, authInterceptor(), AuthService, authGuard() (+36 more)

### Community 46 - "getSodium"
Cohesion: 0.20
Nodes (15): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat(), KeyUpdateFields (+7 more)

### Community 47 - "debts-page.ts"
Cohesion: 0.08
Nodes (43): addDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB (+35 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "toBase64"
Cohesion: 0.07
Nodes (23): AccountDto, AccountRow, Item, toBase64(), toIsoDate(), paymentDto(), toDto(), HouseholdAccess (+15 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 52 - "Account"
Cohesion: 0.16
Nodes (4): Account, AccountDraft, AccountsPage, toDraft()

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "InstallmentsService"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 58 - "PrismaService"
Cohesion: 0.07
Nodes (7): CategoriesController, HouseholdAccessService, RemindersProcessor, PushService, DueReminder, RemindersService, PrismaService

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.13
Nodes (6): SyncQuery, TransactionsController, CreateTransactionsInput, UpdateTransactionsInput, toDto(), TransactionsService

### Community 60 - "recurring.controller.ts"
Cohesion: 0.19
Nodes (7): uuid, CreateRuleInput, createRuleSchema, postOccurrencesSchema, UpdateRuleInput, updateRuleSchema, RecurringService

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

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.33
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.07
Nodes (22): compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), decimal(), optionalAmount(), amount(), fractionToPercent() (+14 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "BudgetsService"
Cohesion: 0.10
Nodes (12): BudgetDialog, BudgetContext, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem (+4 more)

### Community 78 - "registration.service.ts"
Cohesion: 0.14
Nodes (15): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), keyFingerprint() (+7 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "@angular/material"
Cohesion: 0.09
Nodes (32): CurrenciesService, Currency, fromIsoDate(), monthOf(), HouseholdContextService, formatMoney(), AccountDialog, CARD_NETWORKS (+24 more)

### Community 84 - "AccountsService"
Cohesion: 0.26
Nodes (4): CreateAccountInput, UpdateAccountInput, AccountsService, toDto()

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 88 - "accounts.schemas.ts"
Cohesion: 0.20
Nodes (9): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, encryptedPayload (+1 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.08
Nodes (28): todayIso(), toIsoDate(), NUMBER_LOCALE, CRYPTO, NetWorthService, AmountDialog, AmountDialogData, AmountDialogResult (+20 more)

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
Nodes (15): AuthService, JwtAuth, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, KeysService (+7 more)

### Community 98 - "Operación"
Cohesion: 0.25
Nodes (8): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests, Íconos

### Community 99 - "services"
Cohesion: 0.18
Nodes (10): profiles, restart, name, build, ports, profiles, restart, services (+2 more)

### Community 100 - "KeyVaultService"
Cohesion: 0.17
Nodes (6): MeResponse, Identity, DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError, WrongRecoveryPhraseError

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

### Community 108 - "key-vault.service.ts"
Cohesion: 0.35
Nodes (5): generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), toBase64()

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 114 - "scan.mjs"
Cohesion: 0.29
Nodes (4): files(), manifestPath, root, usedIcons()

### Community 115 - "App"
Cohesion: 0.29
Nodes (4): @angular/platform-browser@^22.3.0, App, appConfig, @angular/platform-browser

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
Cohesion: 0.25
Nodes (6): @nestjs/core@^12.0.1, @nestjs/swagger@^12.1.2, document, out, @nestjs/core, @nestjs/swagger

## Knowledge Gaps
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `src/receipts/receipts.service.ts` to `app.module.ts`, `base64.ts`, `zod`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `currencies.controller.ts`, `health.controller.ts`, `test/helpers.ts`, `rate-sources.ts`, `toBase64`, `accounts.schemas.ts`, `PrismaService`, `deposits.ts`, `recurring.controller.ts`, `rates.controller.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `progress-engine.ts`, `parseDecimalInput`, `rule-dialog.ts`, `progress.service.ts`, `key-vault.service.ts`, `dependencies`, `registration.service.ts`, `debts-page.ts`, `@angular/material`, `frontend/package.json`, `@angular/forms`, `savings-page.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `zod` to `app.module.ts`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `src/receipts/receipts.service.ts`, `rate-sources.ts`, `toBase64`, `accounts.schemas.ts`, `PrismaService`, `deposits.ts`, `recurring.controller.ts`, `rates.controller.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06161616161616162 - nodes in this community are weakly interconnected._