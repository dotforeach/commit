# Graph Report - commit  (2026-11-26)

## Corpus Check
- 260 files · ~111,544 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .scss 20, (none) 14, .example 2)

## Summary
- 2213 nodes · 5664 edges · 106 communities (80 shown, 26 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b6b4272`
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
- .save
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
- debts-page.ts
- parseDecimalInput
- zod
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- debt-math.ts
- health.controller.ts
- budgets/budgets.service.ts
- src/recurring/recurring.service.ts
- NotificationsService
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- AutoLockService
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- notifications.controller.ts
- rates.controller.ts
- budget-math.ts
- redis
- BudgetPage
- healthcheck
- members.ts
- Login
- .require
- trade-dialog.ts
- Home
- frontend/package.json
- currencies.controller.ts
- backend/README.md
- Converter
- HouseholdRatesController
- DebtsController
- KeyVaultService
- MembersService
- budget-math.spec.ts
- home.ts
- RatesService
- budget-math.ts
- ProgressService
- HouseholdService
- card-cycle.ts
- HouseholdPage
- crypto.spec.ts
- key-update.ts
- PrismaService
- ngsw-config.json
- FakePush
- keyFingerprint
- Recover
- savings-math.ts
- migrate
- key-vault.service.ts
- change-passphrase.ts
- EsArDateAdapter
- Register
- InstallmentsService
- adminer
- JoinPage
- Frontend
- me.controller.ts
- reminder-plan.ts
- .oxlintrc.json
- RedisModule
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds
- App

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 71 edges
2. `PrismaService` - 66 edges
3. `@angular/core` - 66 edges
4. `parseDecimalInput()` - 51 edges
5. `KeyVaultService` - 41 edges
6. `@angular/common` - 40 edges
7. `@angular/material` - 38 edges
8. `@jsverse/transloco` - 38 edges
9. `toBase64()` - 36 edges
10. `getSodium()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (106 total, 26 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/platform-express@^12.0.1 (+15 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (44): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+36 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.15
Nodes (9): ioredis@^6.1.0, familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis (+1 more)

### Community 7 - "UsersRepository"
Cohesion: 0.14
Nodes (7): RegisterInput, AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, UsersRepository

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.09
Nodes (16): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+8 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.15
Nodes (26): memberKeySignedMessage(), PublicRate, newUser(), payload(), payload(), setup(), payload(), setup() (+18 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0 (+16 more)

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
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (18): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+10 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.08
Nodes (21): @nestjs/core@^12.0.1, @nestjs/swagger@^12.1.2, AccountsModule, AppModule, BudgetsModule, CategoriesModule, DebtsModule, HouseholdsModule (+13 more)

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
Cohesion: 0.05
Nodes (42): uuid, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, updateBudgetSchema, base64Bytes(), encryptedPayload (+34 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.15
Nodes (14): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+6 more)

### Community 29 - "TransactionsController"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.10
Nodes (20): CurrenciesService, Currency, monthOf(), formatMoney(), CARD_NETWORKS, decimal(), accountIcon(), AccountsService (+12 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.05
Nodes (38): fromIsoDate(), todayIso(), toIsoDate(), Frequency, compareDecimals(), isNegative(), normalize(), parseDecimalInput() (+30 more)

### Community 32 - "zod"
Cohesion: 0.17
Nodes (3): InstallmentsController, CreatePlanInput, InstallmentsService

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 36 - "DepositsService"
Cohesion: 0.07
Nodes (6): DepositsController, DepositsService, dto(), dto(), GoalsController, GoalsService

### Community 37 - "debt-math.ts"
Cohesion: 0.36
Nodes (10): amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt (+2 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.12
Nodes (5): BudgetsController, CreateBudgetInput, UpdateBudgetInput, BudgetsService, toDto()

### Community 41 - "src/recurring/recurring.service.ts"
Cohesion: 0.10
Nodes (13): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+5 more)

### Community 43 - "debts-page.ts"
Cohesion: 0.10
Nodes (30): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, KeyVaultService, HouseholdContextService, OfflineCacheService (+22 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.08
Nodes (27): routes, authInterceptor(), authGuard(), guestGuard(), remember(), takeReturnUrl(), unlockedGuard(), AUTO_LOCK_OPTIONS (+19 more)

### Community 47 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "notifications.controller.ts"
Cohesion: 0.07
Nodes (16): AuthModule, Env, envSchema, createReminder, markRead, NotificationsController, subscription, unsubscribe (+8 more)

### Community 52 - "rates.controller.ts"
Cohesion: 0.09
Nodes (14): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), RateSources, RatesModule, RATES_QUEUE (+6 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.23
Nodes (9): AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount(), totalsByCurrency() (+1 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "members.ts"
Cohesion: 0.18
Nodes (10): @nestjs/throttler@^6.8.0, accept, defaultHousehold, grant, invite, role, rotate, uuid (+2 more)

### Community 59 - ".require"
Cohesion: 0.11
Nodes (15): toBase64(), toIsoDate(), paymentDto(), toDto(), toDto(), assetClass, assetDto(), CASH_TYPE (+7 more)

### Community 60 - "trade-dialog.ts"
Cohesion: 0.24
Nodes (6): optional(), positive(), TradeDialog, AssetClass, TradeType, InvestmentsDto

### Community 62 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

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
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.21
Nodes (5): MeResponse, Identity, WrongPassphraseError, WrongRecoveryPhraseError, fromBase64()

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "budget-math.spec.ts"
Cohesion: 0.32
Nodes (4): BudgetContext, cat(), ctx(), Category

### Community 71 - "home.ts"
Cohesion: 0.22
Nodes (5): MeHousehold, RegisterRequest, TokenResponse, AuthService, isNetworkError()

### Community 73 - "budget-math.ts"
Cohesion: 0.19
Nodes (20): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC, subDecimals() (+12 more)

### Community 76 - "card-cycle.ts"
Cohesion: 0.18
Nodes (17): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+9 more)

### Community 78 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 79 - "key-update.ts"
Cohesion: 0.23
Nodes (14): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat(), KeyUpdateFields (+6 more)

### Community 80 - "PrismaService"
Cohesion: 0.10
Nodes (8): AccountDto, AccountRow, Item, CategoriesController, HouseholdAccess, HouseholdAccessService, PrismaService, authUserSelect

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 86 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

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
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "me.controller.ts"
Cohesion: 0.11
Nodes (9): verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, KeysService, MeController (+1 more)

### Community 98 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

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

### Community 113 - "App"
Cohesion: 0.29
Nodes (4): @angular/platform-browser@^22.3.0, App, appConfig, @angular/platform-browser

## Knowledge Gaps
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `UsersRepository`, `accounts.schemas.ts`, `test/helpers.ts`, `deposits.ts`, `TransactionsController`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `notifications.controller.ts`, `rates.controller.ts`, `members.ts`, `.require`, `currencies.controller.ts`, `DebtsController`, `PrismaService`, `me.controller.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `zod`, `ProgressController`, `HouseholdRatesController`, `me.controller.ts`, `health.controller.ts`, `UsersRepository`, `budgets/budgets.service.ts`, `.require`, `src/recurring/recurring.service.ts`, `test/helpers.ts`, `InvestmentsService`, `@nestjs/common`, `notifications.controller.ts`, `rates.controller.ts`, `members.ts`, `deposits.ts`, `TransactionsController`, `currencies.controller.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@jsverse/transloco` to `home.ts`, `debts-page.ts`, `dependencies`, `key-vault.service.ts`, `frontend/package.json`, `trade-dialog.ts`, `debts-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06161616161616162 - nodes in this community are weakly interconnected._