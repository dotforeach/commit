# Graph Report - commit  (2026-11-26)

## Corpus Check
- 280 files · ~126,198 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 44 file(s) not represented in the graph (top: .scss 23, (none) 14, .example 2)

## Summary
- 2296 nodes · 5904 edges · 106 communities (72 shown, 34 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 156 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c5e2fc4f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- savings-page.ts
- scripts
- frontend
- dependencies
- devDependencies
- auth.controller.ts
- redis-refresh-token.store.ts
- articles.ts
- accounts.schemas.ts
- AccountsService
- compilerOptions
- test/helpers.ts
- dependencies
- debt-dialog.ts
- registration.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- currencies.controller.ts
- ledger.ts
- backend-dev
- frontend
- environment
- services
- frontend-dev
- TransactionsPage
- volumes
- deposits.ts
- pick
- rates.e2e-spec.ts
- AccountsService
- parseDecimalInput
- @nestjs/common
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- DepositsService
- health.controller.ts
- CurrentUser
- budgets/budgets.service.ts
- recurring.schemas.ts
- .require
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- debts-page.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- frontend/package.json
- PrismaService
- TransactionsService
- redis
- BudgetPage
- healthcheck
- me.controller.ts
- parseDecimalInput
- debt-math.ts
- SavingsPage
- recurring-page.ts
- recurring.model.ts
- e2e/helpers.ts
- backend/README.md
- Converter
- HouseholdRatesController
- debts.controller.ts
- MeResponse
- MembersService
- AuthController
- app.ts
- savings-page.ts
- .updateKeys
- transaction-dialog.ts
- HouseholdService
- NotificationsService
- HouseholdPage
- recover.ts
- getSodium
- RemindersScheduler
- ngsw-config.json
- plan.e2e.ts
- card-cycle.ts
- Unlock
- Recover
- migrate
- identity.ts
- budget-math.spec.ts
- version.ts
- AutoLockService
- FakePush
- adminer
- AccountsPage
- Frontend
- UsersRepository
- TradeDialog
- ArticlePage
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- nest-cli.json
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 71 edges
2. `@angular/core` - 71 edges
3. `PrismaService` - 66 edges
4. `parseDecimalInput()` - 53 edges
5. `KeyVaultService` - 42 edges
6. `@angular/material` - 42 edges
7. `@jsverse/transloco` - 42 edges
8. `@angular/common` - 41 edges
9. `toBase64()` - 36 edges
10. `getSodium()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `BudgetContext` --references--> `Transaction`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/transactions/transaction.model.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts

## Import Cycles
- None detected.

## Communities (106 total, 34 thin omitted)

### Community 0 - "savings-page.ts"
Cohesion: 0.08
Nodes (31): TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection() (+23 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1 (+23 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (49): author, description, devDependencies, dotenv@^18.0.10, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1 (+41 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.19
Nodes (13): CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, RegisterInput, registerSchema (+5 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "articles.ts"
Cohesion: 0.12
Nodes (20): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+12 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (18): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+10 more)

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.15
Nodes (26): memberKeySignedMessage(), PublicRate, newUser(), payload(), payload(), setup(), payload(), setup() (+18 more)

### Community 12 - "dependencies"
Cohesion: 0.07
Nodes (26): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+18 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.05
Nodes (29): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), round2(), simulatePayoff(), suggestSplit() (+21 more)

### Community 14 - "registration.service.ts"
Cohesion: 0.16
Nodes (16): RegistrationForm, RegistrationService, FAST_KDF, deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker(), pending, randomSalt() (+8 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (18): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+10 more)

### Community 19 - "ledger.ts"
Cohesion: 0.23
Nodes (3): TransactionDto, Page, TransactionsService

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
Nodes (50): base64Bytes(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, isoDate, collectDeposit, createDeposit (+42 more)

### Community 28 - "pick"
Cohesion: 0.15
Nodes (7): expense(), newDebt(), createAccount(), pick(), expense(), newRule(), newTransaction()

### Community 29 - "rates.e2e-spec.ts"
Cohesion: 0.08
Nodes (14): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), RateSources, PublicRatesController, RatesModule (+6 more)

### Community 30 - "AccountsService"
Cohesion: 0.15
Nodes (11): CurrenciesService, Currency, toInputValue(), CARD_NETWORKS, decimal(), AccountsService, BudgetDialogData, optionalAmount() (+3 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.07
Nodes (26): todayIso(), toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), amount(), PaymentDialog (+18 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.07
Nodes (22): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule (+14 more)

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.13
Nodes (7): @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.09
Nodes (13): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+5 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.10
Nodes (13): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+5 more)

### Community 42 - ".require"
Cohesion: 0.08
Nodes (16): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), InstallmentsController, uuid, CreatePlanInput (+8 more)

### Community 43 - "debts-page.ts"
Cohesion: 0.10
Nodes (28): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse (+20 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.07
Nodes (36): App, appConfig, NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard() (+28 more)

### Community 46 - "debts-page.ts"
Cohesion: 0.07
Nodes (50): addDecimals(), formatMoney(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), ARS (+42 more)

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

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 52 - "PrismaService"
Cohesion: 0.08
Nodes (6): HouseholdAccessService, RemindersProcessor, PushService, DueReminder, RemindersService, PrismaService

### Community 53 - "TransactionsService"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "me.controller.ts"
Cohesion: 0.18
Nodes (9): kdfParamsSchema, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, updateKeysSchema, KeysService (+1 more)

### Community 62 - "recurring.model.ts"
Cohesion: 0.28
Nodes (4): Frequency, RuleDto, RulePayload, RuleDialog

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.23
Nodes (7): nextIn(), readPhrase(), registerViaUi(), strip(), unlock(), safeDay, @playwright/test

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "debts.controller.ts"
Cohesion: 0.11
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "MeResponse"
Cohesion: 0.24
Nodes (4): MeResponse, Identity, DEFAULT_KDF_PARAMS, UpdateKeysRequest

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 74 - "transaction-dialog.ts"
Cohesion: 0.20
Nodes (4): accountIcon(), CategoriesService, Mode, TransactionPrefill

### Community 78 - "recover.ts"
Cohesion: 0.15
Nodes (11): @scure/bip39@^2.4.0, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), CURRENCIES, Register (+3 more)

### Community 79 - "getSodium"
Cohesion: 0.14
Nodes (14): keyFingerprint(), generateIdentity(), wipeIdentity(), KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed() (+6 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "card-cycle.ts"
Cohesion: 0.10
Nodes (19): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+11 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - "identity.ts"
Cohesion: 0.26
Nodes (9): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), openPrivateKeys(), sealAad(), SealContext (+1 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "UsersRepository"
Cohesion: 0.13
Nodes (6): AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, UsersRepository

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `debts.controller.ts`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `.require`, `health.controller.ts`, `recurring.schemas.ts`, `test/helpers.ts`, `currencies.controller.ts`, `PrismaService`, `TransactionsService`, `me.controller.ts`, `deposits.ts`, `rates.e2e-spec.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `savings-page.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08408249603384453 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@jsverse/transloco` to `savings-page.ts`, `articles.ts`, `transaction-dialog.ts`, `debts-page.ts`, `dependencies`, `registration.service.ts`, `recover.ts`, `debts-page.ts`, `frontend/package.json`, `AccountsService`, `parseDecimalInput`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `UsersRepository`, `@nestjs/common`, `health.controller.ts`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `.require`, `recurring.schemas.ts`, `.updateKeys`, `test/helpers.ts`, `currencies.controller.ts`, `TransactionsService`, `me.controller.ts`, `deposits.ts`, `rates.e2e-spec.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05568627450980392 - nodes in this community are weakly interconnected._