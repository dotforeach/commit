# Graph Report - commit  (2026-11-26)

## Corpus Check
- 283 files · ~127,382 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 44 file(s) not represented in the graph (top: .scss 23, (none) 14, .example 2)

## Summary
- 2318 nodes · 5926 edges · 121 communities (79 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 156 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `516e4f36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SavingsService
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
- debts-page.ts
- parseDecimalInput
- @nestjs/common
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- budget-math.ts
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
- base64.ts
- parseDecimalInput
- plan.service.ts
- recurring-page.ts
- zod
- e2e/helpers.ts
- backend/README.md
- Converter
- notifications.controller.ts
- debts.controller.ts
- MeResponse
- MembersService
- src/recurring/recurring.service.ts
- savings-math.ts
- onboarding-page.ts
- .require
- transaction-dialog.ts
- HouseholdService
- NotificationsService
- HouseholdPage
- crypto.spec.ts
- getSodium
- RemindersScheduler
- ngsw-config.json
- plan.e2e.ts
- card-statement.ts
- InstallmentsService
- Recover
- migrate
- identity.ts
- budget-math.spec.ts
- version.ts
- AutoLockService
- reminder-plan.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- budget-math.spec.ts
- ArticlePage
- PlanPage
- Register
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- keyFingerprint
- wipeIdentity
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
9. `AccountsService` - 36 edges
10. `toBase64()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `amountOrEmpty()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/onboarding/onboarding-page.ts → frontend/src/app/core/money/decimal.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/transactions/transactions.service.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (121 total, 42 thin omitted)

### Community 0 - "SavingsService"
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
Cohesion: 0.15
Nodes (9): ioredis@^6.1.0, familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis (+1 more)

### Community 7 - "articles.ts"
Cohesion: 0.12
Nodes (20): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+12 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (3): AccountsController, AccountsService, toDto()

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.11
Nodes (31): memberKeySignedMessage(), PublicRate, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, newUser(), payload() (+23 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+17 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.09
Nodes (13): DebtDialog, Amortization, Debt, DebtDraft, DebtDto, DebtKind, DebtPayload, DebtPayment (+5 more)

### Community 14 - "registration.service.ts"
Cohesion: 0.20
Nodes (11): RegistrationForm, DEFAULT_KDF_PARAMS, UpdateKeysRequest, generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), Sodium (+3 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 19 - "ledger.ts"
Cohesion: 0.23
Nodes (4): Transaction, TransactionDto, Page, TransactionsService

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

### Community 28 - "pick"
Cohesion: 0.19
Nodes (6): expense(), newDebt(), pick(), expense(), newRule(), newTransaction()

### Community 29 - "rates.e2e-spec.ts"
Cohesion: 0.05
Nodes (17): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), RateSources (+9 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.13
Nodes (14): CurrenciesService, Currency, monthOf(), formatMoney(), CARD_NETWORKS, AccountsService, BudgetDialogData, optionalAmount() (+6 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.07
Nodes (33): toIsoDate(), compareDecimals(), isNegative(), normalize(), NUMBER_LOCALE, parseDecimalInput(), stripThousands(), THOUSANDS (+25 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.08
Nodes (24): @nestjs/swagger@^12.1.2, AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema (+16 more)

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.14
Nodes (3): BudgetsController, CreateBudgetInput, BudgetsService

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.13
Nodes (8): isoDate, InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto()

### Community 43 - "debts-page.ts"
Cohesion: 0.09
Nodes (32): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, KeyVaultService, HouseholdContextService (+24 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.07
Nodes (32): App, appConfig, NAV, NavItem, routes, RegisterRequest, TokenResponse, authInterceptor() (+24 more)

### Community 46 - "budget-math.ts"
Cohesion: 0.11
Nodes (30): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB, USD (+22 more)

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

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 52 - "PrismaService"
Cohesion: 0.08
Nodes (12): CategoriesController, HouseholdAccess, HouseholdAccessService, accept, defaultHousehold, grant, invite, role (+4 more)

### Community 53 - "TransactionsService"
Cohesion: 0.14
Nodes (4): SyncQuery, TransactionsController, toDto(), TransactionsService

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "base64.ts"
Cohesion: 0.08
Nodes (25): uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema, day (+17 more)

### Community 60 - "plan.service.ts"
Cohesion: 0.16
Nodes (19): amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt (+11 more)

### Community 62 - "zod"
Cohesion: 0.13
Nodes (18): SAFE_LAG_MS, syncPage(), syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema, fields, isTransfer() (+10 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.18
Nodes (8): createAccount(), nextIn(), readPhrase(), registerViaUi(), strip(), unlock(), safeDay, @playwright/test

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 66 - "notifications.controller.ts"
Cohesion: 0.09
Nodes (9): createReminder, markRead, NotificationsController, subscription, unsubscribe, uuid, RemindersProcessor, PushService (+1 more)

### Community 67 - "debts.controller.ts"
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "MeResponse"
Cohesion: 0.21
Nodes (5): MeResponse, Identity, WrongPassphraseError, WrongRecoveryPhraseError, fromBase64()

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 70 - "src/recurring/recurring.service.ts"
Cohesion: 0.21
Nodes (11): revision, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+3 more)

### Community 71 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

### Community 72 - "onboarding-page.ts"
Cohesion: 0.08
Nodes (10): todayIso(), amountOrEmpty(), FIXED, OnboardingPage, positive(), RatesPage, RELEVANT, USD_TYPES (+2 more)

### Community 74 - "transaction-dialog.ts"
Cohesion: 0.12
Nodes (11): DATE_PROVIDERS, EsArDateAdapter, fromIsoDate(), accountIcon(), DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES, Mode (+3 more)

### Community 78 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 79 - "getSodium"
Cohesion: 0.23
Nodes (14): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat(), KeyUpdateFields (+6 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "card-statement.ts"
Cohesion: 0.17
Nodes (18): ZERO, closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad() (+10 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - "identity.ts"
Cohesion: 0.20
Nodes (10): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), openPrivateKeys(), sealAad() (+2 more)

### Community 92 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "@nestjs/authentication"
Cohesion: 0.07
Nodes (14): @nestjs/throttler@^6.8.0, JwtAuth, UpdateKeysInput, updateKeysSchema, KeysService, MeController, AuthUser, @nestjs/authentication (+6 more)

### Community 97 - "budget-math.spec.ts"
Cohesion: 0.32
Nodes (4): BudgetContext, cat(), ctx(), Category

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

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `notifications.controller.ts`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `debts.controller.ts`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `currencies.controller.ts`, `PrismaService`, `base64.ts`, `deposits.ts`, `rates.e2e-spec.ts`, `zod`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@jsverse/transloco` to `articles.ts`, `onboarding-page.ts`, `transaction-dialog.ts`, `debts-page.ts`, `dependencies`, `registration.service.ts`, `frontend/package.json`, `plan.service.ts`, `debts-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `@nestjs/authentication`, `@nestjs/common`, `notifications.controller.ts`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `currencies.controller.ts`, `base64.ts`, `deposits.ts`, `rates.e2e-spec.ts`, `zod`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._