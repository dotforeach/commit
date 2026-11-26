# Graph Report - commit  (2026-11-26)

## Corpus Check
- 251 files · ~94,128 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .scss 20, (none) 14, .example 2)

## Summary
- 2169 nodes · 5544 edges · 111 communities (79 shown, 32 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 154 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b47dd92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- savings.service.ts
- scripts
- frontend
- dependencies
- devDependencies
- auth.controller.ts
- redis-refresh-token.store.ts
- UsersRepository
- accounts.schemas.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- debt-dialog.ts
- identity.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @nestjs/common
- card-cycle.ts
- backend-dev
- frontend
- environment
- services
- frontend-dev
- TransactionsPage
- volumes
- deposits.ts
- e2e/helpers.ts
- TransactionsController
- recurring-page.ts
- parseDecimalInput
- HouseholdAccessService
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- GoalsService
- health.controller.ts
- budgets/budgets.service.ts
- PrismaService
- .save
- @angular/core
- InvestmentsService
- @angular/core
- savings-page.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- PrismaService
- rates.controller.ts
- budget-math.ts
- redis
- BudgetPage
- healthcheck
- RecurringService
- Login
- .require
- debt-math.ts
- Home
- frontend/package.json
- Recover
- backend/README.md
- Converter
- HouseholdRatesController
- DebtsController
- KeyVaultService
- MembersService
- backend/package.json
- AuthService
- RatesService
- budget-math.ts
- ProgressService
- HouseholdService
- OnboardingPage
- HouseholdPage
- crypto.spec.ts
- key-update.ts
- budget.model.ts
- ngsw-config.json
- FakePush
- frontend/package.json
- RatesPage
- budget-math.spec.ts
- migrate
- key-vault.service.ts
- change-passphrase.ts
- PaymentDialog
- Register
- keyFingerprint
- adminer
- JoinPage
- Frontend
- me.controller.ts
- @types/supertest@^7.0.0
- vitest@^4.1.2
- libsodium-wrappers-sumo
- @types/pg@^8.23.1
- .oxlintrc.json
- @types/web-push@^3.6.4
- @angular/cdk@22.3.0
- allowBuilds
- @angular/platform-browser
- nest-cli.json
- tslib@^2.3.0
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 71 edges
2. `PrismaService` - 66 edges
3. `@angular/core` - 64 edges
4. `parseDecimalInput()` - 51 edges
5. `KeyVaultService` - 41 edges
6. `@angular/common` - 39 edges
7. `@angular/material` - 38 edges
8. `@jsverse/transloco` - 38 edges
9. `toBase64()` - 36 edges
10. `getSodium()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `buildRegistration()` --calls--> `memberKeySignedMessage()`  [EXTRACTED]
  backend/test/helpers.ts → backend/src/auth/member-key-signature.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts
- `dto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/deposits/deposits.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (111 total, 32 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+12 more)

### Community 4 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint-tsgolint@^7.0.2001, prettier@^3.4.2, supertest@^7.0.0 (+16 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.10
Nodes (17): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+9 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.15
Nodes (9): ioredis@^6.1.0, familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis (+1 more)

### Community 7 - "UsersRepository"
Cohesion: 0.18
Nodes (6): JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect, UsersRepository

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (17): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+9 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.11
Nodes (13): AccountDialog, CARD_NETWORKS, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon(), AccountPayload (+5 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.15
Nodes (26): DueReminder, PrismaService, newUser(), payload(), payload(), setup(), payload(), setup() (+18 more)

### Community 12 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0, @angular/service-worker@^22.3.0 (+6 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.09
Nodes (14): DebtDialog, Amortization, Debt, DebtDraft, DebtDto, DebtKind, DebtPayload, DebtPayment (+6 more)

### Community 14 - "identity.ts"
Cohesion: 0.20
Nodes (10): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), openPrivateKeys(), sealAad() (+2 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (14): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+6 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (18): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+10 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.05
Nodes (23): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule (+15 more)

### Community 19 - "card-cycle.ts"
Cohesion: 0.09
Nodes (25): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+17 more)

### Community 20 - "backend-dev"
Cohesion: 0.13
Nodes (15): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+7 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.38
Nodes (12): environment, environment, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT, REDIS_URL (+4 more)

### Community 23 - "services"
Cohesion: 0.25
Nodes (8): x-backend-env, DATABASE_URL, JWT_SECRET, PORT, REDIS_URL, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT

### Community 24 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 27 - "deposits.ts"
Cohesion: 0.06
Nodes (44): base64Bytes(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, isoDate, collectDeposit, createDeposit (+36 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.16
Nodes (13): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+5 more)

### Community 29 - "TransactionsController"
Cohesion: 0.08
Nodes (20): syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+12 more)

### Community 30 - "recurring-page.ts"
Cohesion: 0.18
Nodes (7): Frequency, RuleDto, RulePayload, RuleDialog, ConfirmData, ConfirmDialog, confirmDialog()

### Community 31 - "parseDecimalInput"
Cohesion: 0.10
Nodes (40): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), compareDecimals(), formatMoney() (+32 more)

### Community 32 - "HouseholdAccessService"
Cohesion: 0.08
Nodes (6): CategoriesController, HouseholdAccessService, HouseholdsModule, InstallmentsController, CreatePlanInput, InstallmentsService

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 36 - "DepositsService"
Cohesion: 0.13
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.08
Nodes (13): deleteQuerySchema, BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema (+5 more)

### Community 42 - ".save"
Cohesion: 0.22
Nodes (4): Transaction, TransactionDto, Page, TransactionsService

### Community 43 - "@angular/core"
Cohesion: 0.12
Nodes (25): HouseholdPayload, MeHousehold, KeyVaultService, HouseholdContextService, SessionService, Installment, PlanDto, CategoryDto (+17 more)

### Community 44 - "InvestmentsService"
Cohesion: 0.14
Nodes (3): assetDto(), InvestmentsController, InvestmentsService

### Community 45 - "@angular/core"
Cohesion: 0.05
Nodes (30): App, appConfig, routes, RegisterRequest, TokenResponse, authInterceptor(), authGuard(), guestGuard() (+22 more)

### Community 46 - "savings-page.ts"
Cohesion: 0.10
Nodes (22): AmountDialog, AmountDialogData, AmountDialogResult, DepositDialog, optional(), TradeDialog, toMoneyString(), averageMonthlyExpenses() (+14 more)

### Community 47 - "BudgetsService"
Cohesion: 0.30
Nodes (3): Budget, BudgetDraft, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, start, start:debug, start:dev (+7 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "PrismaService"
Cohesion: 0.13
Nodes (4): NotificationsController, RemindersProcessor, PushService, RemindersService

### Community 52 - "rates.controller.ts"
Cohesion: 0.09
Nodes (15): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources, RatesModule (+7 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.17
Nodes (17): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ARS, BTC, subDecimals(), toUnits() (+9 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "RecurringService"
Cohesion: 0.11
Nodes (11): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+3 more)

### Community 59 - ".require"
Cohesion: 0.14
Nodes (10): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), toDto(), priceDto(), tradeDto() (+2 more)

### Community 60 - "debt-math.ts"
Cohesion: 0.24
Nodes (12): amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt (+4 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+8 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 66 - "HouseholdRatesController"
Cohesion: 0.12
Nodes (3): HouseholdRatesController, HouseholdRatesService, PublicRatesController

### Community 67 - "DebtsController"
Cohesion: 0.11
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.21
Nodes (5): MeResponse, Identity, WrongPassphraseError, WrongRecoveryPhraseError, fromBase64()

### Community 69 - "MembersService"
Cohesion: 0.09
Nodes (12): verifyEd25519(), accept, defaultHousehold, grant, hashToken(), invite, MembersController, MembersService (+4 more)

### Community 70 - "backend/package.json"
Cohesion: 0.09
Nodes (21): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, oxlint@^1.58.0, source-map-support@^0.5.21 (+13 more)

### Community 73 - "budget-math.ts"
Cohesion: 0.24
Nodes (12): ratioOf(), BudgetProgress, carriedInto(), computeBudget(), GROUP_SPLIT, GroupProgress, ItemProgress, ItemStatus (+4 more)

### Community 78 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 79 - "key-update.ts"
Cohesion: 0.23
Nodes (14): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat(), KeyUpdateFields (+6 more)

### Community 80 - "budget.model.ts"
Cohesion: 0.17
Nodes (5): BudgetDialog, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): @fontsource/roboto@5.3.0, material-symbols@0.49.0, license, name, packageManager, private, version, @fontsource/roboto (+1 more)

### Community 86 - "budget-math.spec.ts"
Cohesion: 0.32
Nodes (4): BudgetContext, cat(), ctx(), Category

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - "key-vault.service.ts"
Cohesion: 0.20
Nodes (11): RegistrationForm, DEFAULT_KDF_PARAMS, UpdateKeysRequest, generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), Sodium (+3 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 96 - "me.controller.ts"
Cohesion: 0.10
Nodes (10): @nestjs/throttler@^6.8.0, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, KeysService, MeController (+2 more)

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 109 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.10, prisma@7.10.1, dotenv, prisma

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `test/helpers.ts` to `dependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `UsersRepository`, `accounts.schemas.ts`, `@nestjs/common`, `deposits.ts`, `TransactionsController`, `HouseholdAccessService`, `health.controller.ts`, `budgets/budgets.service.ts`, `PrismaService`, `rates.controller.ts`, `RecurringService`, `.require`, `DebtsController`, `MembersService`, `backend/package.json`, `me.controller.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `test/helpers.ts` to `auth.controller.ts`, `UsersRepository`, `accounts.schemas.ts`, `@nestjs/common`, `deposits.ts`, `TransactionsController`, `HouseholdAccessService`, `ProgressController`, `DepositsService`, `GoalsService`, `health.controller.ts`, `budgets/budgets.service.ts`, `PrismaService`, `InvestmentsService`, `PrismaService`, `rates.controller.ts`, `RecurringService`, `.require`, `HouseholdRatesController`, `MembersService`, `me.controller.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `features/accounts/accounts.service.ts`, `@angular/core`, `dependencies`, `savings-page.ts`, `frontend/package.json`, `key-vault.service.ts`, `recurring-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._