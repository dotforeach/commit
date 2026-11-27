# Graph Report - commit  (2026-11-26)

## Corpus Check
- 299 files · ~134,202 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 45 file(s) not represented in the graph (top: .scss 24, (none) 14, .example 2)

## Summary
- 2404 nodes · 6129 edges · 130 communities (82 shown, 48 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4342054`
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
- goal-dialog.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- tools-math.ts
- TransactionsService
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
- decimal.ts
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- features/recurring/recurring.service.ts
- InvestmentsService
- @angular/core
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
- goals.ts
- credit-card-page.ts
- src/transactions/transactions.service.ts
- app.config.ts
- recurring-page.ts
- src/debts/debts.service.ts
- e2e/helpers.ts
- backend/README.md
- Converter
- NotificationsController
- debts.controller.ts
- KeyVaultService
- MembersService
- session-keys.ts
- bank-rates.ts
- parseDecimalInput
- .require
- @angular/router
- HouseholdService
- settings-page.ts
- HouseholdPage
- Register
- ChangePassphrase
- frontend/package.json
- ngsw-config.json
- card-cycle.ts
- PlanPage
- .require
- Recover
- rates-page.ts
- getSodium
- savings-page.ts
- version.ts
- debit-card-page.ts
- openapi.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- RemindersScheduler
- Unlock
- RuleDialog
- home.ts
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- libsodium-wrappers-sumo
- @angular/cdk@22.3.0
- allowBuilds
- rxjs@~7.8.0

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
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `TransactionDialog` --references--> `LedgerEntry`  [EXTRACTED]
  frontend/src/app/features/transactions/transaction-dialog/transaction-dialog.ts → frontend/src/app/features/transactions/transaction.model.ts
- `BudgetDialog` --references--> `BudgetMethod`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/features/budget/budget.model.ts

## Import Cycles
- None detected.

## Communities (130 total, 48 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.06
Nodes (27): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+19 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+16 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (43): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, oxlint@^1.58.0, oxlint-tsgolint@^7.0.2001 (+35 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "progress-engine.ts"
Cohesion: 0.05
Nodes (41): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+33 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (3): AccountsController, CreateAccountInput, AccountsService

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (13): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload (+5 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.07
Nodes (42): @nestjs/testing@^12.0.1, AppModule, memberKeySignedMessage(), coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED (+34 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0, @angular/router@^22.3.0 (+9 more)

### Community 13 - "debts-page.ts"
Cohesion: 0.06
Nodes (30): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), round2(), ScheduleRow, simulatePayoff() (+22 more)

### Community 14 - "goal-dialog.ts"
Cohesion: 0.11
Nodes (6): toInputValue(), BudgetDialog, GoalDialog, positive(), GoalKind, TransactionDialog

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.11
Nodes (16): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+8 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (21): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+13 more)

### Community 18 - "tools-math.ts"
Cohesion: 0.20
Nodes (16): CardPayoff, cardPayoff(), CardPayoffInput, compoundGrowth(), CompoundInput, CompoundYear, DebitAccountInput, debitAnnualCost() (+8 more)

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
Cohesion: 0.15
Nodes (3): LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 27 - "deposits.ts"
Cohesion: 0.08
Nodes (22): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule (+14 more)

### Community 28 - "toBase64"
Cohesion: 0.11
Nodes (17): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), toDto(), assetClass, assetDto() (+9 more)

### Community 29 - "rates.module.ts"
Cohesion: 0.09
Nodes (14): createManual, HouseholdRatesService, PublicRatesController, settings, USD_RATE_TYPES, uuid, RatesModule, RATES_QUEUE (+6 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.20
Nodes (15): CurrenciesService, Currency, monthOf(), formatMoney(), BudgetDialogData, toMoney(), ScheduleDialog, ICONS (+7 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.13
Nodes (15): fromIsoDate(), toIsoDate(), compareDecimals(), accountIcon(), amount(), fractionToPercent(), percentToFraction(), shiftPoint() (+7 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.07
Nodes (21): AccountsModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema, CurrenciesController, CurrenciesModule (+13 more)

### Community 35 - "decimal.ts"
Cohesion: 0.18
Nodes (14): fromUnits(), isNegative(), negateDecimal(), normalize(), NUMBER_LOCALE, percentOf(), ratioOf(), BTC (+6 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.14
Nodes (3): BudgetsController, BudgetsService, toDto()

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.14
Nodes (5): RecurringController, CreateRuleInput, PostOccurrencesInput, RecurringService, toDto()

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.16
Nodes (5): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, InstallmentsService

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.13
Nodes (25): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdContextService, OfflineCacheService, Installment, PlanDto (+17 more)

### Community 45 - "@angular/core"
Cohesion: 0.09
Nodes (16): NAV, NavItem, DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError, WrongRecoveryPhraseError, SessionService, ThemePreference (+8 more)

### Community 46 - "budget-math.ts"
Cohesion: 0.08
Nodes (35): addDecimals(), subDecimals(), ZERO, BudgetContext, BudgetProgress, carriedInto(), computeBudget(), GROUP_SPLIT (+27 more)

### Community 47 - "BudgetsService"
Cohesion: 0.20
Nodes (7): Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

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
Cohesion: 0.12
Nodes (16): devDependencies, @angular/build@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+8 more)

### Community 52 - "PrismaService"
Cohesion: 0.08
Nodes (14): @nestjs/throttler@^6.8.0, CategoriesController, HouseholdAccess, HouseholdAccessService, accept, defaultHousehold, grant, invite (+6 more)

### Community 53 - "TransactionsService"
Cohesion: 0.14
Nodes (3): TransactionsController, toDto(), TransactionsService

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "goals.ts"
Cohesion: 0.06
Nodes (31): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+23 more)

### Community 58 - "credit-card-page.ts"
Cohesion: 0.21
Nodes (8): CompoundPage, CreditCardPage, MortgagePage, moneyFormatter(), num(), pct(), percentText(), USD

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.08
Nodes (32): base64Bytes(), isoDate, SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, encryptedPayload, uuid (+24 more)

### Community 60 - "app.config.ts"
Cohesion: 0.15
Nodes (6): App, appConfig, routes, authInterceptor(), TranslocoHttpLoader, SelectivePreloading

### Community 62 - "src/debts/debts.service.ts"
Cohesion: 0.28
Nodes (9): uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload, UpdateDebtInput (+1 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.10
Nodes (16): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+8 more)

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
Cohesion: 0.24
Nodes (4): MeResponse, Identity, KeyVaultService, fromBase64()

### Community 69 - "MembersService"
Cohesion: 0.07
Nodes (20): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+12 more)

### Community 70 - "session-keys.ts"
Cohesion: 0.20
Nodes (13): AutoLockService, b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity() (+5 more)

### Community 71 - "bank-rates.ts"
Cohesion: 0.17
Nodes (10): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SBP_JULY_2026 (+2 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.13
Nodes (8): todayIso(), parseDecimalInput(), optionalAmount(), PaymentDialog, amountOrEmpty(), FIXED, OnboardingPage, positive()

### Community 74 - "@angular/router"
Cohesion: 0.14
Nodes (13): authGuard(), guestGuard(), landingGuard(), remember(), unlockedGuard(), DATE_PROVIDERS, EsArDateAdapter, Login (+5 more)

### Community 76 - "settings-page.ts"
Cohesion: 0.11
Nodes (4): AUTO_LOCK_OPTIONS, ThemeService, NotificationsService, SettingsPage

### Community 80 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): @angular/service-worker@^22.3.0, material-symbols@0.49.0, @angular/cli@^22.3.0, license, name, packageManager, private, version (+3 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "card-cycle.ts"
Cohesion: 0.11
Nodes (17): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), statementMonthOf() (+9 more)

### Community 87 - "rates-page.ts"
Cohesion: 0.13
Nodes (5): RatesPage, RELEVANT, USD_TYPES, ManualRate, RatesService

### Community 88 - "getSodium"
Cohesion: 0.08
Nodes (44): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF (+36 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.11
Nodes (9): CategoriesService, AmountDialog, AmountDialogData, AmountDialogResult, amountValidator(), optional(), positive(), TradeDialog (+1 more)

### Community 91 - "debit-card-page.ts"
Cohesion: 0.29
Nodes (3): SAVINGS_RULE, AccountRow, DebitCardPage

### Community 92 - "openapi.ts"
Cohesion: 0.33
Nodes (4): @nestjs/swagger@^12.1.2, document, out, @nestjs/swagger

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "@nestjs/authentication"
Cohesion: 0.08
Nodes (10): JwtAuth, KeysService, MeController, AuthUser, @nestjs/authentication, AuthenticationTypes, UsersModule, authUserSelect (+2 more)

### Community 100 - "home.ts"
Cohesion: 0.14
Nodes (7): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, isNetworkError(), NetWorthService

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 105 - "dotenv"
Cohesion: 0.22
Nodes (7): ioredis@^6.1.0, dotenv@^18.0.10, prisma@7.10.1, redis, dotenv, ioredis, prisma

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `dependencies`, `devDependencies`, `MembersService`, `redis-refresh-token.store.ts`, `health.controller.ts`, `src/transactions/transactions.service.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `PrismaService`, `goals.ts`, `deposits.ts`, `toBase64`, `rates.module.ts`, `src/debts/debts.service.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.060455486542443065 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `progress-engine.ts`, `AccountsService`, `dependencies`, `goal-dialog.ts`, `debts-page.ts`, `parseDecimalInput`, `features/recurring/recurring.service.ts`, `credit-card-page.ts`, `app.config.ts`, `bank-rates.ts`, `parseDecimalInput`, `@angular/router`, `settings-page.ts`, `frontend/package.json`, `rates-page.ts`, `getSodium`, `savings-page.ts`, `debit-card-page.ts`, `home.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `KeyVaultService` connect `KeyVaultService` to `home.ts`, `AccountsService`, `@angular/router`, `features/recurring/recurring.service.ts`, `@angular/core`, `getSodium`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._