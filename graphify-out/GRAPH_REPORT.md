# Graph Report - commit  (2026-11-26)

## Corpus Check
- 201 files · ~71,094 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 35 file(s) not represented in the graph (top: .scss 15, (none) 14, .example 2)

## Summary
- 1714 nodes · 4341 edges · 73 communities (62 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a054d3dc`
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
- src/accounts/accounts.service.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- features/debts/debts.service.ts
- key-vault.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @nestjs/common
- InstallmentsService
- backend-dev
- frontend
- environment
- services
- frontend-dev
- TransactionsPage
- volumes
- currencies.controller.ts
- e2e/helpers.ts
- TransactionsController
- Unlock
- parseDecimalInput
- installments.controller.ts
- investments.ts
- deposits.ts
- @jsverse/transloco
- DepositsService
- GoalsService
- health.controller.ts
- home.ts
- src/transactions/transactions.service.ts
- PrismaService
- .require
- TransactionsService
- InvestmentsService
- schedule-dialog.ts
- @angular/core
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- savings-math.ts
- CategoriesService
- budget-math.ts
- redis
- BudgetPage
- healthcheck
- transaction.model.ts
- Login
- ledger.ts
- cards/installments.service.ts
- Home
- backend/README.md
- migrate
- adminer
- Frontend
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 56 edges
2. `@angular/core` - 50 edges
3. `PrismaService` - 48 edges
4. `parseDecimalInput()` - 42 edges
5. `getSodium()` - 34 edges
6. `@angular/material` - 31 edges
7. `@jsverse/transloco` - 30 edges
8. `@angular/common` - 30 edges
9. `TransactionsService` - 29 edges
10. `AccountsService` - 29 edges

## Surprising Connections (you probably didn't know these)
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/transactions/transactions.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toIsoDate()`  [EXTRACTED]
  backend/src/transactions/transactions.service.ts → backend/src/common/sync.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `averageMonthlyExpenses()` --calls--> `addDecimals()`  [EXTRACTED]
  frontend/src/app/features/savings/savings-math.ts → frontend/src/app/core/money/decimal.ts
- `BudgetDialog` --references--> `BudgetMethod`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/features/budget/budget.model.ts

## Import Cycles
- None detected.

## Communities (73 total, 11 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.07
Nodes (19): TradeDialog, Asset, AssetClass, Contribution, Deposit, DepositPayload, Goal, GoalDraft (+11 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (42): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+34 more)

### Community 3 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1 (+15 more)

### Community 4 - "backend/package.json"
Cohesion: 0.06
Nodes (42): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+34 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.11
Nodes (9): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, RedisModule, redis (+1 more)

### Community 7 - "src/auth/auth.service.ts"
Cohesion: 0.07
Nodes (19): AuthModule, RegisterInput, AuthService, JwtAuth, verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed() (+11 more)

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.13
Nodes (6): AccountsController, CreateAccountInput, listQuerySchema, UpdateAccountInput, AccountsService, toDto()

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.18
Nodes (20): memberKeySignedMessage(), newUser(), payload(), payload(), setup(), payload(), setup(), b64() (+12 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (30): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+22 more)

### Community 13 - "features/debts/debts.service.ts"
Cohesion: 0.07
Nodes (24): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+16 more)

### Community 14 - "key-vault.service.ts"
Cohesion: 0.07
Nodes (48): MeResponse, RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad() (+40 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (14): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+6 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (21): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+13 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.07
Nodes (28): AccountsModule, AppModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule, HouseholdsModule (+20 more)

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

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.08
Nodes (28): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+20 more)

### Community 29 - "TransactionsController"
Cohesion: 0.14
Nodes (3): TransactionsController, toDto(), TransactionsService

### Community 31 - "parseDecimalInput"
Cohesion: 0.07
Nodes (33): fromIsoDate(), toIsoDate(), compareDecimals(), isNegative(), normalize(), parseDecimalInput(), stripThousands(), toInputValue() (+25 more)

### Community 32 - "installments.controller.ts"
Cohesion: 0.14
Nodes (7): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto()

### Community 33 - "investments.ts"
Cohesion: 0.09
Nodes (27): toBase64(), linkedTransaction, toIsoDate(), uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema (+19 more)

### Community 34 - "deposits.ts"
Cohesion: 0.06
Nodes (36): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+28 more)

### Community 35 - "@jsverse/transloco"
Cohesion: 0.10
Nodes (15): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), unlockedGuard(), DATE_PROVIDERS (+7 more)

### Community 36 - "DepositsService"
Cohesion: 0.13
Nodes (3): LinkedTransaction, DepositsController, DepositsService

### Community 38 - "health.controller.ts"
Cohesion: 0.13
Nodes (7): @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 39 - "home.ts"
Cohesion: 0.10
Nodes (15): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, KeyVaultService, WrongPassphraseError, WrongRecoveryPhraseError (+7 more)

### Community 40 - "src/transactions/transactions.service.ts"
Cohesion: 0.14
Nodes (18): isoDate, syncPage(), SyncQuery, syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+10 more)

### Community 41 - "PrismaService"
Cohesion: 0.11
Nodes (6): AccountDto, AccountRow, CategoriesController, HouseholdAccess, HouseholdAccessService, PrismaService

### Community 42 - ".require"
Cohesion: 0.06
Nodes (8): BudgetsController, CreateBudgetInput, BudgetsService, toDto(), DebtsController, DebtsService, RecurringController, RecurringService

### Community 43 - "TransactionsService"
Cohesion: 0.22
Nodes (3): TransactionDto, Page, TransactionsService

### Community 45 - "schedule-dialog.ts"
Cohesion: 0.24
Nodes (3): toMoney(), PaymentDialog, ScheduleDialog

### Community 46 - "@angular/core"
Cohesion: 0.22
Nodes (17): CurrenciesService, Currency, monthOf(), todayIso(), HouseholdContextService, formatMoney(), CARD_NETWORKS, AccountsService (+9 more)

### Community 47 - "BudgetsService"
Cohesion: 0.20
Nodes (7): Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

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
Cohesion: 0.21
Nodes (13): toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress (+5 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.15
Nodes (26): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC, subDecimals() (+18 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "transaction.model.ts"
Cohesion: 0.15
Nodes (11): BudgetContext, cat(), ctx(), card, plan, InstallmentPlan, Category, Transaction (+3 more)

### Community 59 - "ledger.ts"
Cohesion: 0.22
Nodes (9): ZERO, AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount() (+1 more)

### Community 60 - "cards/installments.service.ts"
Cohesion: 0.40
Nodes (10): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), statementMonthOf() (+2 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

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
Cohesion: 0.40
Nodes (4): allowBuilds, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `installments.controller.ts`, `investments.ts`, `deposits.ts`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `src/auth/auth.service.ts`, `health.controller.ts`, `PrismaService`, `src/transactions/transactions.service.ts`, `test/helpers.ts`, `currencies.controller.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07033315705975675 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `savings.service.ts`, `@jsverse/transloco`, `home.ts`, `dependencies`, `schedule-dialog.ts`, `key-vault.service.ts`, `cards/installments.service.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `dependencies`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06423034330011074 - nodes in this community are weakly interconnected._