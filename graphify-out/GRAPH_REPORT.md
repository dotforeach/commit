# Graph Report - commit  (2026-11-26)

## Corpus Check
- 247 files · ~93,282 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .scss 20, (none) 14, .example 2)

## Summary
- 2156 nodes · 5512 edges · 106 communities (82 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 154 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f709120`
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
- @nestjs/authentication
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
- app.routes.ts
- parseDecimalInput
- installments/installments.service.ts
- ProgressController
- progress-engine.ts
- notifications.service.ts
- DepositsService
- GoalsService
- health.controller.ts
- registration.service.ts
- budgets/budgets.service.ts
- PrismaService
- .save
- @angular/core
- InvestmentsService
- @angular/router
- savings-page.ts
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
- debts-page.ts
- Home
- frontend/package.json
- Recover
- backend/README.md
- Converter
- HouseholdRatesController
- DebtsController
- KeyVaultService
- MembersService
- backend/package.json
- AuthService
- RatesService
- RedisModule
- ProgressService
- HouseholdService
- OnboardingPage
- HouseholdPage
- register.ts
- key-update.ts
- app.ts
- ngsw-config.json
- FakePush
- AccountsPage
- RatesPage
- reminder-plan.ts
- migrate
- .register
- change-passphrase.ts
- app.config.ts
- progress-page.ts
- RemindersScheduler
- adminer
- oxlint@^1.58.0
- Frontend
- me.controller.ts
- @types/supertest@^7.0.0
- vitest@^4.1.2
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 71 edges
2. `PrismaService` - 66 edges
3. `@angular/core` - 63 edges
4. `parseDecimalInput()` - 51 edges
5. `KeyVaultService` - 40 edges
6. `@angular/material` - 38 edges
7. `@jsverse/transloco` - 38 edges
8. `@angular/common` - 38 edges
9. `getSodium()` - 36 edges
10. `toBase64()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `user()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/members.e2e-spec.ts → backend/test/helpers.ts
- `newRule()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/recurring.e2e.ts → frontend/e2e/helpers.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts

## Import Cycles
- None detected.

## Communities (106 total, 24 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (43): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+35 more)

### Community 3 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+12 more)

### Community 4 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint-tsgolint@^7.0.2001, source-map-support@^0.5.21, supertest@^7.0.0 (+15 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.15
Nodes (9): ioredis@^6.1.0, familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis (+1 more)

### Community 7 - "@nestjs/authentication"
Cohesion: 0.08
Nodes (22): @nestjs/throttler@^6.8.0, RegisterInput, AuthService, JwtAuth, memberKeySignedMessage(), verifyEd25519(), accept, defaultHousehold (+14 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (18): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+10 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.13
Nodes (13): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon() (+5 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.17
Nodes (23): newUser(), payload(), payload(), setup(), payload(), setup(), b64(), buildRegistration() (+15 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+18 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.09
Nodes (14): DebtDialog, Amortization, Debt, DebtDraft, DebtDto, DebtKind, DebtPayload, DebtPayment (+6 more)

### Community 14 - "identity.ts"
Cohesion: 0.27
Nodes (8): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), openPrivateKeys(), sealAad(), SealContext, sealPrivateKeys()

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
Cohesion: 0.08
Nodes (22): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesController, CategoriesModule, Env, envSchema (+14 more)

### Community 19 - "card-cycle.ts"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

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
Nodes (28): encryptedPayload, keyVersion, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule, fields (+20 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.16
Nodes (13): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+5 more)

### Community 29 - "TransactionsController"
Cohesion: 0.08
Nodes (20): syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+12 more)

### Community 30 - "app.routes.ts"
Cohesion: 0.29
Nodes (6): authGuard(), guestGuard(), remember(), takeReturnUrl(), unlockedGuard(), Unlock

### Community 31 - "parseDecimalInput"
Cohesion: 0.09
Nodes (31): fromIsoDate(), todayIso(), toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), toInputValue() (+23 more)

### Community 32 - "installments/installments.service.ts"
Cohesion: 0.12
Nodes (10): base64Bytes(), InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto() (+2 more)

### Community 34 - "progress-engine.ts"
Cohesion: 0.20
Nodes (16): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+8 more)

### Community 35 - "notifications.service.ts"
Cohesion: 0.14
Nodes (5): AppNotification, NotificationDto, NotificationsService, SettingsPage, @angular/service-worker

### Community 36 - "DepositsService"
Cohesion: 0.13
Nodes (3): DepositsController, DepositsService, dto()

### Community 37 - "GoalsService"
Cohesion: 0.13
Nodes (3): dto(), GoalsController, GoalsService

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 39 - "registration.service.ts"
Cohesion: 0.22
Nodes (8): HouseholdPayload, MeHousehold, RegisterRequest, RegistrationForm, payloadAad(), DEFAULT_CATEGORIES, DefaultCategory, SessionService

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.09
Nodes (12): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+4 more)

### Community 42 - ".save"
Cohesion: 0.14
Nodes (8): BudgetContext, cat(), ctx(), Category, Transaction, TransactionDto, Page, TransactionsService

### Community 43 - "@angular/core"
Cohesion: 0.12
Nodes (30): CurrenciesService, Currency, monthOf(), HouseholdContextService, formatMoney(), BudgetDialogData, optionalAmount(), Installment (+22 more)

### Community 45 - "@angular/router"
Cohesion: 0.22
Nodes (7): DATE_PROVIDERS, EsArDateAdapter, DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES, TRANSACTIONS_ROUTES, @angular/router

### Community 46 - "savings-page.ts"
Cohesion: 0.12
Nodes (21): ZERO, NetWorthService, AmountDialogData, AmountDialogResult, TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount() (+13 more)

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
Cohesion: 0.08
Nodes (10): createReminder, markRead, NotificationsController, subscription, unsubscribe, uuid, RemindersProcessor, PushService (+2 more)

### Community 52 - "rates.controller.ts"
Cohesion: 0.09
Nodes (15): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources, RatesModule (+7 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.12
Nodes (30): addDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC (+22 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "RecurringService"
Cohesion: 0.09
Nodes (14): isoDate, RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput (+6 more)

### Community 59 - ".require"
Cohesion: 0.11
Nodes (15): toBase64(), linkedTransaction, toIsoDate(), paymentDto(), toDto(), assetClass, assetDto(), CASH_TYPE (+7 more)

### Community 60 - "debts-page.ts"
Cohesion: 0.13
Nodes (20): shiftMonth(), estimateStatement(), card, plan, upcomingInstallments(), InstallmentPlan, amortizationSchedule(), frenchPayment() (+12 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (21): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+13 more)

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
Cohesion: 0.19
Nodes (5): MeResponse, Identity, KeyVaultService, WrongPassphraseError, WrongRecoveryPhraseError

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "backend/package.json"
Cohesion: 0.08
Nodes (23): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, prettier@^3.4.2, @types/express@^5.0.0 (+15 more)

### Community 75 - "HouseholdService"
Cohesion: 0.16
Nodes (3): fromBase64(), HouseholdService, JoinPage

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "register.ts"
Cohesion: 0.15
Nodes (12): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), CURRENCIES (+4 more)

### Community 79 - "key-update.ts"
Cohesion: 0.19
Nodes (15): keyFingerprint(), DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), KdfParams, randomSalt(), concat(), KeyUpdateFields, keyUpdateSignedMessage() (+7 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 86 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - ".register"
Cohesion: 0.24
Nodes (7): RegistrationService, generateIdentity(), generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), toBase64()

### Community 90 - "app.config.ts"
Cohesion: 0.29
Nodes (4): appConfig, routes, authInterceptor(), TranslocoHttpLoader

### Community 91 - "progress-page.ts"
Cohesion: 0.29
Nodes (3): ScoreComponent, LEVEL_ICONS, ProgressPage

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 96 - "me.controller.ts"
Cohesion: 0.12
Nodes (7): KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, KeysService, MeController

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
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `dependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `@nestjs/authentication`, `accounts.schemas.ts`, `test/helpers.ts`, `deposits.ts`, `TransactionsController`, `installments/installments.service.ts`, `health.controller.ts`, `budgets/budgets.service.ts`, `PrismaService`, `PrismaService`, `rates.controller.ts`, `RecurringService`, `.require`, `DebtsController`, `backend/package.json`, `me.controller.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `notifications.service.ts`, `AuthService`, `registration.service.ts`, `features/accounts/accounts.service.ts`, `HouseholdService`, `dependencies`, `@angular/router`, `register.ts`, `key-update.ts`, `app.ts`, `savings-page.ts`, `app.routes.ts`, `change-passphrase.ts`, `app.config.ts`, `progress-page.ts`, `debts-page.ts`, `frontend/package.json`, `parseDecimalInput`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.04756871035940803 - nodes in this community are weakly interconnected._
- **Why does `zod` connect `installments/installments.service.ts` to `dependencies`, `DebtsController`, `auth.controller.ts`, `backend/package.json`, `@nestjs/authentication`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `.require`, `@nestjs/common`, `PrismaService`, `rates.controller.ts`, `RecurringService`, `deposits.ts`, `TransactionsController`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._