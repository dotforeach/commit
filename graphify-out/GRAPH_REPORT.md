# Graph Report - commit  (2026-11-26)

## Corpus Check
- 299 files · ~134,145 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 45 file(s) not represented in the graph (top: .scss 24, (none) 14, .example 2)

## Summary
- 2403 nodes · 6129 edges · 134 communities (80 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `df838027`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SavingsService
- scripts
- frontend
- dependencies
- devDependencies
- redis-refresh-token.store.ts
- progress-engine.ts
- accounts.schemas.ts
- AccountsService
- compilerOptions
- test/helpers.ts
- dependencies
- debts-page.ts
- key-vault.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- tools-math.ts
- features/transactions/transactions.service.ts
- backend-dev
- frontend
- environment
- services
- frontend-dev
- TransactionsPage
- volumes
- deposits.ts
- toBase64
- rates.module.ts
- debts-page.ts
- parseDecimalInput
- @nestjs/common
- ProgressController
- HouseholdRatesController
- SettingsPage
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- features/recurring/recurring.service.ts
- InvestmentsService
- @angular/core
- progress.service.ts
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
- accounts.schemas.ts
- parseDecimalInput
- src/transactions/transactions.service.ts
- backend/package.json
- recurring-page.ts
- members.ts
- e2e/helpers.ts
- backend/README.md
- Converter
- NotificationsController
- debts.controller.ts
- KeyVaultService
- MembersService
- session-keys.ts
- budgets/budgets.service.ts
- OnboardingPage
- .require
- EsArDateAdapter
- HouseholdService
- NotificationsService
- HouseholdPage
- Register
- getSodium
- article.model.ts
- ngsw-config.json
- card-cycle.ts
- pick
- .require
- Recover
- RatesService
- crypto.spec.ts
- savings-page.ts
- version.ts
- AutoLockService
- reminder-plan.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- articles.ts
- ArticlePage
- progress-page.ts
- AuthService
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- ProgressService
- RatesPage
- allowBuilds
- ThemeService
- plan.e2e.ts
- landing.ts
- oxlint@^1.58.0
- @types/web-push@^3.6.4
- @vitest/coverage-v8@^4.1.2

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 78 edges
2. `@nestjs/common` - 71 edges
3. `PrismaService` - 66 edges
4. `parseDecimalInput()` - 55 edges
5. `@angular/material` - 47 edges
6. `@jsverse/transloco` - 47 edges
7. `KeyVaultService` - 43 edges
8. `@angular/common` - 42 edges
9. `@angular/router` - 38 edges
10. `AccountsService` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `expense()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/offline.e2e.ts → frontend/e2e/helpers.ts

## Import Cycles
- None detected.

## Communities (134 total, 54 thin omitted)

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
Cohesion: 0.09
Nodes (21): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1 (+13 more)

### Community 4 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, oxlint-tsgolint@^7.0.2001, supertest@^7.0.0, @types/cookie-parser@^1.4.10, @types/express@^5.0.0 (+16 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.15
Nodes (9): ioredis@^6.1.0, familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis (+1 more)

### Community 7 - "progress-engine.ts"
Cohesion: 0.20
Nodes (16): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+8 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (3): AccountsController, CreateAccountInput, AccountsService

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.07
Nodes (42): @nestjs/testing@^12.0.1, AppModule, memberKeySignedMessage(), coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED (+34 more)

### Community 12 - "dependencies"
Cohesion: 0.07
Nodes (26): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+18 more)

### Community 13 - "debts-page.ts"
Cohesion: 0.05
Nodes (34): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+26 more)

### Community 14 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (15): HouseholdPayload, MeHousehold, RegisterRequest, RegistrationForm, keyFingerprint(), DEFAULT_KDF_PARAMS, UpdateKeysRequest, generateHouseholdKey() (+7 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.11
Nodes (16): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+8 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "tools-math.ts"
Cohesion: 0.07
Nodes (35): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+27 more)

### Community 19 - "features/transactions/transactions.service.ts"
Cohesion: 0.12
Nodes (17): AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount(), totalsByCurrency() (+9 more)

### Community 20 - "backend-dev"
Cohesion: 0.13
Nodes (15): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+7 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.33
Nodes (13): environment, environment, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT (+5 more)

### Community 23 - "services"
Cohesion: 0.25
Nodes (8): x-backend-env, DATABASE_URL, JWT_SECRET, PORT, REDIS_URL, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT

### Community 24 - "frontend-dev"
Cohesion: 0.19
Nodes (14): build, build, context, target, API_PROXY_TARGET, build, build, depends_on (+6 more)

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 27 - "deposits.ts"
Cohesion: 0.06
Nodes (40): @nestjs/authentication@^0.1.7, base64Bytes(), encryptedPayload, keyVersion, LinkedTransaction, isoDate, collectDeposit, createDeposit (+32 more)

### Community 28 - "toBase64"
Cohesion: 0.09
Nodes (19): toBase64(), linkedTransaction, toIsoDate(), paymentDto(), toDto(), dto(), HouseholdAccess, toDto() (+11 more)

### Community 29 - "rates.module.ts"
Cohesion: 0.09
Nodes (13): createManual, HouseholdRatesService, PublicRatesController, settings, USD_RATE_TYPES, uuid, RatesModule, RATES_QUEUE (+5 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.13
Nodes (14): CurrenciesService, Currency, monthOf(), formatMoney(), CARD_NETWORKS, decimal(), AccountsService, BudgetDialogData (+6 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.09
Nodes (27): fromIsoDate(), todayIso(), toIsoDate(), compareDecimals(), parseDecimalInput(), toInputValue(), accountIcon(), amount() (+19 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.08
Nodes (20): AccountsModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule, HouseholdsModule (+12 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.14
Nodes (3): BudgetsController, BudgetsService, toDto()

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.14
Nodes (5): RecurringController, CreateRuleInput, PostOccurrencesInput, RecurringService, toDto()

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.15
Nodes (6): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.11
Nodes (21): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdContextService, isNetworkError(), OfflineCacheService, SessionService (+13 more)

### Community 45 - "@angular/core"
Cohesion: 0.06
Nodes (41): App, appConfig, NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard() (+33 more)

### Community 46 - "progress.service.ts"
Cohesion: 0.10
Nodes (34): addDecimals(), fromUnits(), isNegative(), negateDecimal(), normalize(), percentOf(), ratioOf(), BTC (+26 more)

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
Cohesion: 0.09
Nodes (5): CategoriesController, CurrenciesController, CurrenciesModule, HouseholdAccessService, PrismaService

### Community 53 - "TransactionsService"
Cohesion: 0.14
Nodes (3): TransactionsController, toDto(), TransactionsService

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "accounts.schemas.ts"
Cohesion: 0.09
Nodes (24): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+16 more)

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.12
Nodes (18): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+10 more)

### Community 60 - "backend/package.json"
Cohesion: 0.09
Nodes (21): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, prettier@^3.4.2, source-map-support@^0.5.21 (+13 more)

### Community 62 - "members.ts"
Cohesion: 0.13
Nodes (13): @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthModule, accept, defaultHousehold, grant, invite, role (+5 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.15
Nodes (9): createAccount(), nextIn(), readPhrase(), registerViaUi(), strip(), unlock(), expense(), safeDay (+1 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 66 - "NotificationsController"
Cohesion: 0.12
Nodes (4): NotificationsController, RemindersProcessor, PushService, RemindersService

### Community 68 - "KeyVaultService"
Cohesion: 0.18
Nodes (5): MeResponse, Identity, KeyVaultService, WrongPassphraseError, WrongRecoveryPhraseError

### Community 69 - "MembersService"
Cohesion: 0.07
Nodes (20): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+12 more)

### Community 70 - "session-keys.ts"
Cohesion: 0.30
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 71 - "budgets/budgets.service.ts"
Cohesion: 0.18
Nodes (10): uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema (+2 more)

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 79 - "getSodium"
Cohesion: 0.16
Nodes (16): wipeIdentity(), deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat() (+8 more)

### Community 80 - "article.model.ts"
Cohesion: 0.27
Nodes (9): Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, articleBySlug(), ARTICLES (+1 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "card-cycle.ts"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 83 - "pick"
Cohesion: 0.21
Nodes (5): expense(), newDebt(), pick(), newRule(), newTransaction()

### Community 88 - "crypto.spec.ts"
Cohesion: 0.15
Nodes (19): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, generateIdentity() (+11 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.13
Nodes (21): NUMBER_LOCALE, AmountDialogData, AmountDialogResult, optional(), TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount() (+13 more)

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
Cohesion: 0.08
Nodes (11): JwtAuth, UpdateKeysInput, updateKeysSchema, KeysService, MeController, AuthUser, @nestjs/authentication, AuthenticationTypes (+3 more)

### Community 97 - "articles.ts"
Cohesion: 0.33
Nodes (6): Article, DEUDAS, INVERSION, ORDER, PAREJA, PERSONAL

### Community 99 - "progress-page.ts"
Cohesion: 0.22
Nodes (5): PLAN_ARTICLE, TIP_ARTICLE, ScoreComponent, LEVEL_ICONS, ProgressPage

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

### Community 123 - "landing.ts"
Cohesion: 0.40
Nodes (3): FEATURED, FEATURES, Landing

## Knowledge Gaps
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `dependencies`, `MembersService`, `redis-refresh-token.store.ts`, `budgets/budgets.service.ts`, `src/transactions/transactions.service.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `toBase64`, `PrismaService`, `accounts.schemas.ts`, `deposits.ts`, `backend/package.json`, `rates.module.ts`, `members.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `progress-page.ts`, `features/recurring/recurring.service.ts`, `dependencies`, `key-vault.service.ts`, `progress.service.ts`, `article.model.ts`, `tools-math.ts`, `frontend/package.json`, `features/transactions/transactions.service.ts`, `savings-page.ts`, `landing.ts`, `debts-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `plan.e2e.ts`, `pick`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._