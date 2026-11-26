# Graph Report - commit  (2026-11-26)

## Corpus Check
- 262 files · ~111,597 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .scss 20, (none) 14, .example 2)

## Summary
- 2216 nodes · 5670 edges · 108 communities (74 shown, 34 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c82de4dc`
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
- debts-page.ts
- accounts.schemas.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- debt-dialog.ts
- getSodium
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
- savings-page.ts
- parseDecimalInput
- zod
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- DepositsService
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
- NotificationsController
- rates.controller.ts
- TransactionsService
- redis
- BudgetPage
- healthcheck
- accounts.schemas.ts
- Login
- .require
- budgets/budgets.service.ts
- Home
- frontend/package.json
- src/debts/debts.service.ts
- backend/README.md
- Converter
- DebtsController
- KeyVaultService
- MembersService
- onboarding-page.ts
- home.ts
- RatesService
- GoalsService
- ProgressService
- HouseholdService
- kdf.ts
- HouseholdPage
- crypto.spec.ts
- key-update.ts
- PrismaService
- ngsw-config.json
- Unlock
- card-cycle.ts
- Recover
- savings-math.ts
- migrate
- .register
- change-passphrase.ts
- frontend/package.json
- Register
- version.ts
- adminer
- JoinPage
- Frontend
- @nestjs/authentication
- RatesPage
- libsodium-wrappers-sumo
- .oxlintrc.json
- RedisModule
- @angular/cdk@22.3.0
- allowBuilds
- rxjs@~7.8.0
- nest-cli.json
- dotenv
- allowBuilds

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
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts
- `dto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/deposits/deposits.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/installments/installments.service.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (108 total, 34 thin omitted)

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
Cohesion: 0.08
Nodes (26): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+18 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.11
Nodes (16): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+8 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "debts-page.ts"
Cohesion: 0.12
Nodes (25): DebtDialog, fractionToPercent(), percentToFraction(), shiftPoint(), Amortization, amortizationSchedule(), frenchPayment(), monthlyRate() (+17 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (3): AccountsController, AccountsService, toDto()

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.07
Nodes (19): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+11 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.08
Nodes (37): memberKeySignedMessage(), coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources (+29 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0, @angular/router@^22.3.0 (+9 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.12
Nodes (4): Debt, DebtDraft, DebtsPage, DebtsService

### Community 14 - "getSodium"
Cohesion: 0.27
Nodes (10): aeadDecrypt(), aeadEncrypt(), decryptPayload(), keyFingerprint(), generateIdentity(), sealAad(), SealContext, sealPrivateKeys() (+2 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.06
Nodes (24): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema, CurrenciesController (+16 more)

### Community 19 - ".save"
Cohesion: 0.13
Nodes (11): estimateStatement(), card, plan, upcomingInstallments(), InstallmentPlan, Transaction, TransactionDto, TransactionType (+3 more)

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
Nodes (44): toBase64(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, toIsoDate(), paymentDto(), toDto() (+36 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.15
Nodes (14): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+6 more)

### Community 29 - "TransactionsController"
Cohesion: 0.11
Nodes (20): revision, SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema (+12 more)

### Community 30 - "savings-page.ts"
Cohesion: 0.08
Nodes (28): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), formatMoney(), accountIcon() (+20 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.08
Nodes (44): addDecimals(), compareDecimals(), fromUnits(), isNegative(), negateDecimal(), normalize(), parseDecimalInput(), percentOf() (+36 more)

### Community 32 - "zod"
Cohesion: 0.08
Nodes (20): @nestjs/throttler@^6.8.0, base64Bytes(), accept, defaultHousehold, grant, invite, role, rotate (+12 more)

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.14
Nodes (3): BudgetsController, BudgetsService, toDto()

### Community 41 - "src/recurring/recurring.service.ts"
Cohesion: 0.10
Nodes (13): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+5 more)

### Community 43 - "debts-page.ts"
Cohesion: 0.09
Nodes (37): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse (+29 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.06
Nodes (27): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), remember(), unlockedGuard() (+19 more)

### Community 47 - "BudgetsService"
Cohesion: 0.10
Nodes (12): BudgetDialog, BudgetContext, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem (+4 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "NotificationsController"
Cohesion: 0.12
Nodes (4): NotificationsController, RemindersProcessor, PushService, RemindersService

### Community 52 - "rates.controller.ts"
Cohesion: 0.08
Nodes (16): isoDate, createManual, HouseholdRatesController, HouseholdRatesService, PublicRatesController, settings, USD_RATE_TYPES, uuid (+8 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (15): uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema, day (+7 more)

### Community 60 - "budgets/budgets.service.ts"
Cohesion: 0.20
Nodes (9): uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema (+1 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @angular/build@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+8 more)

### Community 63 - "src/debts/debts.service.ts"
Cohesion: 0.28
Nodes (9): uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload, UpdateDebtInput (+1 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.30
Nodes (4): MeResponse, Identity, openPrivateKeys(), fromBase64()

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 76 - "kdf.ts"
Cohesion: 0.43
Nodes (5): deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker(), pending, randomSalt()

### Community 78 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 79 - "key-update.ts"
Cohesion: 0.24
Nodes (9): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8() (+1 more)

### Community 80 - "PrismaService"
Cohesion: 0.12
Nodes (4): CategoriesController, HouseholdAccess, HouseholdAccessService, PrismaService

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "card-cycle.ts"
Cohesion: 0.10
Nodes (20): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+12 more)

### Community 86 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - ".register"
Cohesion: 0.18
Nodes (8): RegistrationService, encryptPayload(), payloadAad(), generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), toBase64()

### Community 90 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): @angular/service-worker@^22.3.0, material-symbols@0.49.0, @angular/cli@^22.3.0, license, name, packageManager, private, version (+3 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "@nestjs/authentication"
Cohesion: 0.07
Nodes (12): JwtAuth, UpdateKeysInput, updateKeysSchema, KeysService, MeController, AuthUser, @nestjs/authentication, AuthenticationTypes (+4 more)

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
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `zod`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `test/helpers.ts`, `PrismaService`, `rates.controller.ts`, `accounts.schemas.ts`, `deposits.ts`, `budgets/budgets.service.ts`, `TransactionsController`, `src/debts/debts.service.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08200290275761973 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `@nestjs/authentication`, `zod`, `health.controller.ts`, `test/helpers.ts`, `@nestjs/common`, `NotificationsController`, `rates.controller.ts`, `accounts.schemas.ts`, `deposits.ts`, `budgets/budgets.service.ts`, `TransactionsController`, `src/debts/debts.service.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/authentication` connect `@nestjs/authentication` to `zod`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `test/helpers.ts`, `dotenv`, `PrismaService`, `@nestjs/common`, `rates.controller.ts`, `accounts.schemas.ts`, `deposits.ts`, `budgets/budgets.service.ts`, `TransactionsController`, `src/debts/debts.service.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._