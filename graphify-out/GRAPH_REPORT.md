# Graph Report - commit  (2026-11-26)

## Corpus Check
- 239 files · ~87,783 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 40 file(s) not represented in the graph (top: .scss 19, (none) 14, .example 2)

## Summary
- 2056 nodes · 5212 edges · 99 communities (75 shown, 24 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 142 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e6e92949`
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
- @nestjs/authentication
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
- installments/installments.service.ts
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
- dates.ts
- savings-page.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- notifications.module.ts
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
- NotificationsController
- DepositsService
- AuthService
- RatesService
- RedisModule
- ProgressService
- addDecimals
- OnboardingPage
- BudgetDialog
- register.ts
- key-update.ts
- Register
- ngsw-config.json
- FakePush
- budget-math.ts
- RatesPage
- SettingsPage
- migrate
- payloadAad
- ChangePassphrase
- adminer
- Frontend
- me.controller.ts
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 69 edges
2. `PrismaService` - 63 edges
3. `@angular/core` - 60 edges
4. `parseDecimalInput()` - 51 edges
5. `@angular/common` - 36 edges
6. `@angular/material` - 36 edges
7. `@jsverse/transloco` - 36 edges
8. `toBase64()` - 34 edges
9. `getSodium()` - 34 edges
10. `compareDecimals()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `buildRegistration()` --calls--> `memberKeySignedMessage()`  [EXTRACTED]
  backend/test/helpers.ts → backend/src/auth/member-key-signature.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (99 total, 24 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.06
Nodes (31): TradeDialog, averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress (+23 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (43): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+35 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, bullmq@^6.7.10, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/platform-express@^12.0.1 (+17 more)

### Community 4 - "backend/package.json"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.14
Nodes (11): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, Credentials, credentialsSchema, RegisterInput, registerSchema, clearRefreshCookie() (+3 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "@nestjs/authentication"
Cohesion: 0.13
Nodes (10): AuthService, JwtAuth, memberKeySignedMessage(), verifyEd25519(), AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect (+2 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (18): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+10 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.18
Nodes (22): newUser(), payload(), payload(), setup(), payload(), setup(), b64(), buildRegistration() (+14 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+18 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.14
Nodes (16): DebtDialog, fractionToPercent(), percentToFraction(), shiftPoint(), Amortization, Debt, DebtDraft, DebtDto (+8 more)

### Community 14 - "getSodium"
Cohesion: 0.21
Nodes (16): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), generateIdentity(), openPrivateKeys(), sealAad() (+8 more)

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
Cohesion: 0.11
Nodes (12): AccountsModule, AppModule, BudgetsModule, CategoriesController, CategoriesModule, DebtsModule, HouseholdsModule, InstallmentsModule (+4 more)

### Community 19 - "card-cycle.ts"
Cohesion: 0.11
Nodes (18): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), shiftMonth() (+10 more)

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
Cohesion: 0.04
Nodes (48): categorySchema, encryptedPayload, kdfParamsSchema, userKeysSchema, base64Bytes(), encryptedPayload, keyVersion, linkedTransaction (+40 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.16
Nodes (13): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+5 more)

### Community 29 - "TransactionsController"
Cohesion: 0.08
Nodes (20): syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+12 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.09
Nodes (28): todayIso(), toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), toInputValue(), CARD_NETWORKS (+20 more)

### Community 32 - "installments/installments.service.ts"
Cohesion: 0.13
Nodes (7): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto()

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 35 - "@angular/core"
Cohesion: 0.09
Nodes (19): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), unlockedGuard(), TranslocoHttpLoader (+11 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 39 - "key-vault.service.ts"
Cohesion: 0.35
Nodes (7): RegistrationForm, DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), randomSalt(), UpdateKeysRequest, DEFAULT_CATEGORIES, DefaultCategory

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.09
Nodes (12): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+4 more)

### Community 41 - "PrismaService"
Cohesion: 0.16
Nodes (3): CurrenciesController, CurrenciesModule, PrismaService

### Community 42 - ".save"
Cohesion: 0.15
Nodes (4): TransactionDto, TransactionType, Page, SingleDraft

### Community 43 - "@angular/core"
Cohesion: 0.13
Nodes (22): KeyVaultService, monthOf(), HouseholdContextService, isNegative(), ZERO, AccountsService, BudgetDialogData, optionalAmount() (+14 more)

### Community 45 - "dates.ts"
Cohesion: 0.08
Nodes (8): DATE_PROVIDERS, EsArDateAdapter, fromIsoDate(), DebtsPage, DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES, TRANSACTIONS_ROUTES

### Community 46 - "savings-page.ts"
Cohesion: 0.12
Nodes (12): CurrenciesService, Currency, formatMoney(), NetWorthService, AmountDialogData, AmountDialogResult, DepositDialog, optional() (+4 more)

### Community 47 - "BudgetsService"
Cohesion: 0.22
Nodes (6): Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, start, start:debug, start:dev (+7 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "notifications.module.ts"
Cohesion: 0.08
Nodes (16): cookie-parser@^1.4.7, @nestjs/core@^12.0.1, AuthModule, Env, envSchema, app, config, NotificationsModule (+8 more)

### Community 52 - "rates.controller.ts"
Cohesion: 0.07
Nodes (17): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources, PublicRatesController (+9 more)

### Community 53 - "budget-math.ts"
Cohesion: 0.15
Nodes (18): fromUnits(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC, subDecimals(), toUnits() (+10 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "RecurringService"
Cohesion: 0.09
Nodes (13): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+5 more)

### Community 59 - ".require"
Cohesion: 0.18
Nodes (8): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), assetDto(), priceDto(), tradeDto()

### Community 60 - "debts-page.ts"
Cohesion: 0.27
Nodes (11): amortizationSchedule(), frenchPayment(), monthlyRate(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt, StrategyResult (+3 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (21): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+13 more)

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
Cohesion: 0.21
Nodes (5): MeResponse, Identity, WrongPassphraseError, WrongRecoveryPhraseError, fromBase64()

### Community 70 - "DepositsService"
Cohesion: 0.27
Nodes (3): LinkedTransaction, DepositsService, dto()

### Community 71 - "AuthService"
Cohesion: 0.20
Nodes (5): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService

### Community 75 - "addDecimals"
Cohesion: 0.27
Nodes (9): addDecimals(), Cycle, estimateStatement(), card, plan, StatementEstimate, upcomingInstallments(), InstallmentPlan (+1 more)

### Community 78 - "register.ts"
Cohesion: 0.23
Nodes (11): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), CURRENCIES (+3 more)

### Community 79 - "key-update.ts"
Cohesion: 0.24
Nodes (9): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8() (+1 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "budget-math.ts"
Cohesion: 0.16
Nodes (15): BudgetContext, BudgetProgress, carriedInto(), computeBudget(), GROUP_SPLIT, GroupProgress, ItemProgress, ItemStatus (+7 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 96 - "me.controller.ts"
Cohesion: 0.10
Nodes (10): @nestjs/throttler@^6.8.0, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, KeysService, MeController (+2 more)

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

- **Why does `@nestjs/common` connect `@nestjs/common` to `dependencies`, `backend/package.json`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `@nestjs/authentication`, `accounts.schemas.ts`, `test/helpers.ts`, `deposits.ts`, `TransactionsController`, `installments/installments.service.ts`, `health.controller.ts`, `budgets/budgets.service.ts`, `PrismaService`, `notifications.module.ts`, `rates.controller.ts`, `RecurringService`, `.require`, `DebtsController`, `me.controller.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05727605727605728 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `savings.service.ts`, `key-vault.service.ts`, `@angular/core`, `dependencies`, `dates.ts`, `savings-page.ts`, `register.ts`, `debt-dialog.ts`, `debts-page.ts`, `frontend/package.json`, `parseDecimalInput`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.04756871035940803 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._