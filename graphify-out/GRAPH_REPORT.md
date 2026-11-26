# Graph Report - commit  (2026-11-26)

## Corpus Check
- 216 files · ~76,331 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 36 file(s) not represented in the graph (top: .scss 16, (none) 14, .example 2)

## Summary
- 1849 nodes · 4651 edges · 87 communities (69 shown, 18 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `309135da`
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
- card-cycle.ts
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
- zod
- @jsverse/transloco
- DepositsService
- GoalsService
- health.controller.ts
- key-vault.service.ts
- src/transactions/transactions.service.ts
- PrismaService
- BudgetsService
- TransactionsService
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
- deposits.ts
- debts.controller.ts
- Home
- frontend/package.json
- recover.ts
- backend/README.md
- Converter
- HouseholdRatesController
- DebtsController
- KeyVaultService
- account-dialog.ts
- .require
- AuthService
- RatesService
- RedisModule
- Register
- NetWorthService
- migrate
- adminer
- Frontend
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 62 edges
2. `PrismaService` - 53 edges
3. `@angular/core` - 53 edges
4. `parseDecimalInput()` - 44 edges
5. `getSodium()` - 34 edges
6. `@angular/common` - 32 edges
7. `@angular/material` - 32 edges
8. `@jsverse/transloco` - 31 edges
9. `AccountsService` - 30 edges
10. `TransactionsService` - 30 edges

## Surprising Connections (you probably didn't know these)
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
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

## Communities (87 total, 18 thin omitted)

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
Cohesion: 0.07
Nodes (23): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+15 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "src/auth/auth.service.ts"
Cohesion: 0.11
Nodes (8): AuthModule, UpdateKeysInput, updateKeysSchema, KeysService, MeController, UsersModule, authUserSelect, @nestjs/authentication

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.13
Nodes (6): AccountsController, CreateAccountInput, listQuerySchema, UpdateAccountInput, AccountsService, toDto()

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.16
Nodes (4): Account, AccountDraft, AccountsPage, toDraft()

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.09
Nodes (32): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources, KeyUpdateFields (+24 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+17 more)

### Community 13 - "features/debts/debts.service.ts"
Cohesion: 0.12
Nodes (4): Debt, DebtDraft, DebtsPage, DebtsService

### Community 14 - "key-vault.service.ts"
Cohesion: 0.11
Nodes (33): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, generateIdentity(), openPrivateKeys() (+25 more)

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
Cohesion: 0.10
Nodes (17): AccountsModule, AppModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule, HouseholdsModule (+9 more)

### Community 19 - "card-cycle.ts"
Cohesion: 0.17
Nodes (13): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+5 more)

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
Cohesion: 0.17
Nodes (12): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+4 more)

### Community 29 - "TransactionsController"
Cohesion: 0.13
Nodes (5): syncPage(), SyncQuery, TransactionsController, toDto(), TransactionsService

### Community 31 - "parseDecimalInput"
Cohesion: 0.07
Nodes (28): toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), toInputValue(), accountIcon(), optionalAmount() (+20 more)

### Community 32 - "installments.controller.ts"
Cohesion: 0.14
Nodes (7): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto()

### Community 33 - "investments.ts"
Cohesion: 0.13
Nodes (16): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), assetClass, assetDto(), CASH_TYPE (+8 more)

### Community 34 - "zod"
Cohesion: 0.11
Nodes (19): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+11 more)

### Community 35 - "@jsverse/transloco"
Cohesion: 0.11
Nodes (15): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), unlockedGuard(), DATE_PROVIDERS (+7 more)

### Community 36 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.13
Nodes (7): @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 39 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (13): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, RegistrationForm, DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), randomSalt() (+5 more)

### Community 40 - "src/transactions/transactions.service.ts"
Cohesion: 0.09
Nodes (24): isoDate, syncQuerySchema, uuid, coherentMessage, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+16 more)

### Community 41 - "PrismaService"
Cohesion: 0.11
Nodes (6): AccountDto, AccountRow, CategoriesController, HouseholdAccess, HouseholdAccessService, PrismaService

### Community 42 - "BudgetsService"
Cohesion: 0.13
Nodes (5): BudgetsController, CreateBudgetInput, UpdateBudgetInput, BudgetsService, toDto()

### Community 43 - "TransactionsService"
Cohesion: 0.19
Nodes (5): TransactionDto, TransactionType, Page, SingleDraft, TransactionsService

### Community 45 - "debt-dialog.ts"
Cohesion: 0.14
Nodes (24): DebtDialog, fractionToPercent(), percentToFraction(), shiftPoint(), Amortization, amortizationSchedule(), frenchPayment(), monthlyRate() (+16 more)

### Community 46 - "@angular/core"
Cohesion: 0.13
Nodes (29): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), HouseholdContextService, formatMoney(), AccountsService (+21 more)

### Community 47 - "BudgetsService"
Cohesion: 0.10
Nodes (12): BudgetDialog, BudgetContext, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem (+4 more)

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
Cohesion: 0.14
Nodes (19): TradeDialog, averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress (+11 more)

### Community 52 - "rates.controller.ts"
Cohesion: 0.09
Nodes (13): createManual, HouseholdRatesService, PublicRatesController, settings, USD_RATE_TYPES, uuid, RatesModule, RATES_QUEUE (+5 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.10
Nodes (38): addDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC (+30 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "RecurringService"
Cohesion: 0.14
Nodes (4): RecurringController, CreateRuleInput, UpdateRuleInput, RecurringService

### Community 59 - "deposits.ts"
Cohesion: 0.10
Nodes (17): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule (+9 more)

### Community 60 - "debts.controller.ts"
Cohesion: 0.15
Nodes (10): uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload, UpdateDebtInput (+2 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (21): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+13 more)

### Community 63 - "recover.ts"
Cohesion: 0.12
Nodes (8): RegistrationService, wipeIdentity(), WrongRecoveryPhraseError, ChangePassphrase, Recover, CURRENCIES, differentFrom(), matchValidator()

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.35
Nodes (4): MeResponse, Identity, KeyVaultService, fromBase64()

### Community 69 - "account-dialog.ts"
Cohesion: 0.19
Nodes (8): AccountDialog, CARD_NETWORKS, decimal(), ACCOUNT_TYPES, AccountDto, AccountPayload, AccountType, CreditCardPayload

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
Cohesion: 0.22
Nodes (7): ioredis@^6.1.0, dotenv@^18.0.10, prisma@7.10.1, redis, dotenv, ioredis, prisma

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `installments.controller.ts`, `investments.ts`, `zod`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `src/auth/auth.service.ts`, `health.controller.ts`, `PrismaService`, `deposits.ts`, `test/helpers.ts`, `src/transactions/transactions.service.ts`, `rates.controller.ts`, `currencies.controller.ts`, `debts.controller.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `installments.controller.ts`, `investments.ts`, `zod`, `auth.controller.ts`, `health.controller.ts`, `src/auth/auth.service.ts`, `src/transactions/transactions.service.ts`, `deposits.ts`, `test/helpers.ts`, `@nestjs/common`, `rates.controller.ts`, `currencies.controller.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `SavingsPage` connect `savings.service.ts` to `@jsverse/transloco`, `@angular/core`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._