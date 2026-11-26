# Graph Report - commit  (2026-11-26)

## Corpus Check
- 255 files · ~95,693 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .scss 20, (none) 14, .example 2)

## Summary
- 2192 nodes · 5614 edges · 115 communities (82 shown, 33 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 154 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f1bf4b2`
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
- GoalsService
- health.controller.ts
- CurrentUser
- budgets/budgets.service.ts
- src/recurring/recurring.service.ts
- app.ts
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- AutoLockService
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
- rates.e2e-spec.ts
- Home
- frontend/package.json
- AccountsController
- backend/README.md
- Converter
- HouseholdRatesController
- DebtsController
- KeyVaultService
- MembersService
- TransactionsController
- home.ts
- RatesService
- budget-math.ts
- ProgressService
- HouseholdService
- card-cycle.ts
- HouseholdPage
- crypto.spec.ts
- key-update.ts
- budgets/budgets.service.ts
- ngsw-config.json
- FakePush
- frontend/package.json
- savings-math.ts
- migrate
- crypto.spec.ts
- change-passphrase.ts
- registration.service.ts
- Register
- InstallmentsService
- adminer
- JoinPage
- Frontend
- me.controller.ts
- card-statement.ts
- reminder-plan.ts
- libsodium-wrappers-sumo
- RatesPage
- .oxlintrc.json
- RedisModule
- @angular/cdk@22.3.0
- allowBuilds
- key-update-signature.ts
- nest-cli.json
- RemindersScheduler
- savings.e2e-spec.ts
- dotenv
- material-symbols@0.49.0
- @scure/bip39
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
- `user()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/rates.e2e-spec.ts → backend/test/helpers.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `dto()` --calls--> `toIsoDate()`  [EXTRACTED]
  backend/src/deposits/deposits.ts → backend/src/common/sync.ts
- `toDto()` --calls--> `toIsoDate()`  [EXTRACTED]
  backend/src/installments/installments.service.ts → backend/src/common/sync.ts
- `toDto()` --calls--> `toIsoDate()`  [EXTRACTED]
  backend/src/recurring/recurring.service.ts → backend/src/common/sync.ts

## Import Cycles
- None detected.

## Communities (115 total, 33 thin omitted)

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
Cohesion: 0.07
Nodes (27): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+19 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.11
Nodes (16): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+8 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "UsersRepository"
Cohesion: 0.14
Nodes (7): JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect, UsersRepository, @nestjs/authentication

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.12
Nodes (15): uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema, day (+7 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.19
Nodes (20): memberKeySignedMessage(), newUser(), payload(), payload(), setup(), payload(), setup(), b64() (+12 more)

### Community 12 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0, @angular/router@^22.3.0, @angular/service-worker@^22.3.0 (+7 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.06
Nodes (26): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+18 more)

### Community 14 - "identity.ts"
Cohesion: 0.25
Nodes (12): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), keyFingerprint(), generateIdentity(), openPrivateKeys(), sealAad() (+4 more)

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
Cohesion: 0.07
Nodes (23): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesController, CategoriesModule, Env, envSchema (+15 more)

### Community 19 - ".save"
Cohesion: 0.16
Nodes (4): TransactionDto, TransactionType, Page, SingleDraft

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
Nodes (33): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule (+25 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.15
Nodes (14): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+6 more)

### Community 29 - "TransactionsController"
Cohesion: 0.10
Nodes (21): isoDate, SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.12
Nodes (19): CurrenciesService, Currency, fromIsoDate(), monthOf(), formatMoney(), accountIcon(), BudgetDialogData, optionalAmount() (+11 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.06
Nodes (37): todayIso(), toIsoDate(), compareDecimals(), isNegative(), normalize(), parseDecimalInput(), stripThousands(), toInputValue() (+29 more)

### Community 32 - "zod"
Cohesion: 0.14
Nodes (8): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto(), zod

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 36 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.13
Nodes (4): BudgetsController, CreateBudgetInput, BudgetsService, toDto()

### Community 41 - "src/recurring/recurring.service.ts"
Cohesion: 0.16
Nodes (12): uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema, ruleFields (+4 more)

### Community 42 - "app.ts"
Cohesion: 0.07
Nodes (11): App, appConfig, routes, authInterceptor(), TranslocoHttpLoader, SelectivePreloading, NotificationsBell, AppNotification (+3 more)

### Community 43 - "debts-page.ts"
Cohesion: 0.15
Nodes (21): UpdateKeysRequest, HouseholdContextService, isNetworkError(), OfflineCacheService, Installment, PlanDto, CategoryDto, CRYPTO (+13 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.10
Nodes (21): authGuard(), guestGuard(), remember(), takeReturnUrl(), unlockedGuard(), AUTO_LOCK_OPTIONS, WrongPassphraseError, DATE_PROVIDERS (+13 more)

### Community 47 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

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
Cohesion: 0.09
Nodes (5): HouseholdAccessService, RemindersProcessor, PushService, RemindersService, PrismaService

### Community 52 - "rates.controller.ts"
Cohesion: 0.12
Nodes (8): PublicRatesController, RatesModule, RATES_QUEUE, RatesProcessor, RatesScheduler, argentinaToday(), RatesService, @nestjs/bullmq

### Community 53 - "budget-math.ts"
Cohesion: 0.14
Nodes (14): BudgetContext, cat(), ctx(), Category, AccountBalance, buildLedger(), computeBalances(), CurrencyTotals (+6 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 59 - ".require"
Cohesion: 0.08
Nodes (17): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), assetClass, assetDto(), CASH_TYPE (+9 more)

### Community 60 - "rates.e2e-spec.ts"
Cohesion: 0.17
Nodes (9): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources, FakeSources (+1 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+8 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "DebtsController"
Cohesion: 0.11
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.16
Nodes (6): MeResponse, Identity, KeyVaultService, WrongRecoveryPhraseError, fromBase64(), SessionService

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 71 - "home.ts"
Cohesion: 0.20
Nodes (5): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService

### Community 73 - "budget-math.ts"
Cohesion: 0.19
Nodes (20): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC, subDecimals() (+12 more)

### Community 76 - "card-cycle.ts"
Cohesion: 0.31
Nodes (11): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), shiftMonth() (+3 more)

### Community 78 - "crypto.spec.ts"
Cohesion: 0.27
Nodes (6): byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), Recover

### Community 79 - "key-update.ts"
Cohesion: 0.24
Nodes (9): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8() (+1 more)

### Community 80 - "budgets/budgets.service.ts"
Cohesion: 0.18
Nodes (9): deleteQuerySchema, uuid, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema (+1 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): @angular/compiler@^22.3.0, rxjs@~7.8.0, rxjs, license, name, packageManager, private, version (+1 more)

### Community 86 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - "crypto.spec.ts"
Cohesion: 0.21
Nodes (9): RegistrationService, payloadAad(), FAST_KDF, generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), recoveryKeyFromPhrase() (+1 more)

### Community 90 - "registration.service.ts"
Cohesion: 0.24
Nodes (9): RegistrationForm, DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker(), pending, randomSalt(), DEFAULT_CATEGORIES (+1 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 96 - "me.controller.ts"
Cohesion: 0.08
Nodes (16): @nestjs/throttler@^6.8.0, base64Bytes(), accept, defaultHousehold, grant, invite, role, rotate (+8 more)

### Community 97 - "card-statement.ts"
Cohesion: 0.27
Nodes (7): ZERO, Cycle, card, plan, StatementEstimate, upcomingInstallments(), InstallmentPlan

### Community 98 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 105 - "key-update-signature.ts"
Cohesion: 0.47
Nodes (4): KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 108 - "savings.e2e-spec.ts"
Cohesion: 0.83
Nodes (3): linked(), payload(), setup()

### Community 109 - "dotenv"
Cohesion: 0.22
Nodes (7): ioredis@^6.1.0, dotenv@^18.0.10, prisma@7.10.1, redis, dotenv, ioredis, prisma

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `UsersRepository`, `accounts.schemas.ts`, `test/helpers.ts`, `deposits.ts`, `TransactionsController`, `zod`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `rates.controller.ts`, `.require`, `rates.e2e-spec.ts`, `DebtsController`, `budgets/budgets.service.ts`, `me.controller.ts`, `savings.e2e-spec.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `debts-page.ts` to `app.ts`, `dependencies`, `@jsverse/transloco`, `frontend/package.json`, `registration.service.ts`, `debts-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `frontend/package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._