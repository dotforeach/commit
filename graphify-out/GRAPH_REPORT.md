# Graph Report - commit  (2026-11-26)

## Corpus Check
- 224 files · ~83,471 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 38 file(s) not represented in the graph (top: .scss 18, (none) 14, .example 2)

## Summary
- 1944 nodes · 4932 edges · 101 communities (73 shown, 28 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 135 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77ef72b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- savings.service.ts
- scripts
- frontend
- dependencies
- backend/package.json
- auth.controller.ts
- redis-refresh-token.store.ts
- src/auth/auth.service.ts
- accounts.schemas.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- features/debts/debts.service.ts
- getSodium
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
- Unlock
- parseDecimalInput
- zod
- ProgressController
- progress-engine.ts
- @angular/core
- DepositsService
- GoalsService
- health.controller.ts
- key-vault.service.ts
- budgets/budgets.service.ts
- PrismaService
- .save
- @angular/core
- InvestmentsService
- debt-dialog.ts
- @angular/core
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- savings-math.ts
- rates.controller.ts
- budget-math.ts
- redis
- BudgetPage
- healthcheck
- RecurringService
- Login
- investments.ts
- debts-page.ts
- Home
- frontend/package.json
- Recover
- backend/README.md
- Converter
- DebtsController
- KeyVaultService
- frontend/package.json
- .require
- AuthService
- RatesService
- RedisModule
- ProgressService
- TradeDialog
- InstallmentsService
- register.ts
- key-update.ts
- @angular/platform-browser
- libsodium-wrappers-sumo
- rxjs@~7.8.0
- budget-math.ts
- RatesPage
- vitest@^5.0.0
- migrate
- payloadAad
- ChangePassphrase
- adminer
- Frontend
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 64 edges
2. `PrismaService` - 56 edges
3. `@angular/core` - 56 edges
4. `parseDecimalInput()` - 51 edges
5. `getSodium()` - 34 edges
6. `@angular/material` - 34 edges
7. `compareDecimals()` - 33 edges
8. `@angular/common` - 33 edges
9. `@jsverse/transloco` - 33 edges
10. `AccountsService` - 32 edges

## Surprising Connections (you probably didn't know these)
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `user()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/progress.e2e-spec.ts → backend/test/helpers.ts
- `amountOrEmpty()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/onboarding/onboarding-page.ts → frontend/src/app/core/money/decimal.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts

## Import Cycles
- None detected.

## Communities (101 total, 28 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (42): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+34 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+17 more)

### Community 4 - "backend/package.json"
Cohesion: 0.06
Nodes (43): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+35 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.15
Nodes (9): ioredis@^6.1.0, familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis (+1 more)

### Community 7 - "src/auth/auth.service.ts"
Cohesion: 0.07
Nodes (20): RegisterInput, AuthService, JwtAuth, verifyEd25519(), Env, app, config, UpdateKeysInput (+12 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (18): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+10 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.11
Nodes (28): memberKeySignedMessage(), mid(), RateSources, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, newUser() (+20 more)

### Community 12 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0, @fontsource/roboto@5.3.0 (+7 more)

### Community 13 - "features/debts/debts.service.ts"
Cohesion: 0.07
Nodes (25): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+17 more)

### Community 14 - "getSodium"
Cohesion: 0.25
Nodes (16): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), FAST_KDF, generateIdentity(), openPrivateKeys() (+8 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (14): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+6 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.09
Nodes (14): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, envSchema, CurrenciesModule, DebtsModule (+6 more)

### Community 19 - "card-cycle.ts"
Cohesion: 0.23
Nodes (16): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+8 more)

### Community 20 - "backend-dev"
Cohesion: 0.15
Nodes (13): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+5 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.44
Nodes (9): environment, environment, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT, REDIS_URL (+1 more)

### Community 23 - "services"
Cohesion: 0.25
Nodes (7): name, services, x-backend-env, DATABASE_URL, JWT_SECRET, PORT, REDIS_URL

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
Cohesion: 0.07
Nodes (23): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule (+15 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.16
Nodes (13): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+5 more)

### Community 29 - "TransactionsController"
Cohesion: 0.13
Nodes (5): TransactionsController, CreateTransactionsInput, UpdateTransactionsInput, toDto(), TransactionsService

### Community 31 - "parseDecimalInput"
Cohesion: 0.09
Nodes (21): todayIso(), compareDecimals(), parseDecimalInput(), ZERO, amount(), PaymentDialog, positive(), amountOrEmpty() (+13 more)

### Community 32 - "zod"
Cohesion: 0.07
Nodes (25): base64Bytes(), syncPage(), SyncQuery, syncQuerySchema, InstallmentsController, uuid, CreatePlanInput, createPlanSchema (+17 more)

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 35 - "@angular/core"
Cohesion: 0.09
Nodes (18): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), unlockedGuard(), DATE_PROVIDERS (+10 more)

### Community 36 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 39 - "key-vault.service.ts"
Cohesion: 0.25
Nodes (10): HouseholdPayload, MeHousehold, RegisterRequest, RegistrationForm, DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), randomSalt(), UpdateKeysRequest (+2 more)

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.09
Nodes (12): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+4 more)

### Community 41 - "PrismaService"
Cohesion: 0.10
Nodes (5): CategoriesController, CurrenciesController, HouseholdAccess, HouseholdAccessService, PrismaService

### Community 42 - ".save"
Cohesion: 0.15
Nodes (4): TransactionDto, TransactionType, Page, SingleDraft

### Community 43 - "@angular/core"
Cohesion: 0.15
Nodes (21): KeyVaultService, HouseholdContextService, SessionService, Installment, PlanDto, CategoryDto, CRYPTO, NetWorthService (+13 more)

### Community 45 - "debt-dialog.ts"
Cohesion: 0.18
Nodes (10): fromIsoDate(), toIsoDate(), toInputValue(), fractionToPercent(), percentToFraction(), shiftPoint(), DepositDialog, GoalDialog (+2 more)

### Community 46 - "@angular/core"
Cohesion: 0.13
Nodes (18): CurrenciesService, Currency, monthOf(), formatMoney(), isNegative(), normalize(), stripThousands(), CARD_NETWORKS (+10 more)

### Community 47 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, format, lint, start, start:debug, start:dev (+6 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

### Community 52 - "rates.controller.ts"
Cohesion: 0.07
Nodes (19): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, PublicRate, createManual, HouseholdRatesController, PublicRatesController (+11 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.16
Nodes (21): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC, subDecimals() (+13 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "RecurringService"
Cohesion: 0.14
Nodes (3): RecurringController, CreateRuleInput, RecurringService

### Community 59 - "investments.ts"
Cohesion: 0.08
Nodes (26): toBase64(), isoDate, toIsoDate(), paymentDto(), toDto(), assetClass, assetDto(), CASH_TYPE (+18 more)

### Community 60 - "debts-page.ts"
Cohesion: 0.16
Nodes (5): accountIcon(), CategoriesService, ScheduleDialog, Mode, TransactionPrefill

### Community 62 - "frontend/package.json"
Cohesion: 0.14
Nodes (14): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+6 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "DebtsController"
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.20
Nodes (6): MeResponse, Identity, WrongPassphraseError, WrongRecoveryPhraseError, recoveryKeyFromPhrase(), fromBase64()

### Community 69 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): @angular/compiler@^22.3.0, tslib@^2.3.0, license, name, packageManager, private, version, @angular/compiler (+1 more)

### Community 76 - "TradeDialog"
Cohesion: 0.33
Nodes (4): TradeDialog, AssetClass, TradeType, InvestmentsDto

### Community 78 - "register.ts"
Cohesion: 0.17
Nodes (9): byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), CURRENCIES, Register, differentFrom() (+1 more)

### Community 79 - "key-update.ts"
Cohesion: 0.24
Nodes (9): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8() (+1 more)

### Community 83 - "budget-math.ts"
Cohesion: 0.15
Nodes (13): BudgetContext, BudgetProgress, GROUP_SPLIT, GroupProgress, ItemProgress, ItemStatus, previousMonth(), cat() (+5 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

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
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `rxjs` connect `@angular/core` to `dependencies`, `backend/package.json`, `@angular/core`?**
  _High betweenness centrality (0.390) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `src/auth/auth.service.ts` to `zod`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `DebtsController`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `PrismaService`, `deposits.ts`, `health.controller.ts`, `test/helpers.ts`, `@nestjs/common`, `rates.controller.ts`, `investments.ts`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `zod` to `dependencies`, `backend/package.json`, `auth.controller.ts`, `DebtsController`, `src/auth/auth.service.ts`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `PrismaService`, `investments.ts`, `rates.controller.ts`, `deposits.ts`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05990338164251208 - nodes in this community are weakly interconnected._