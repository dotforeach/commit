# Graph Report - commit  (2026-11-26)

## Corpus Check
- 268 files · ~116,162 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .scss 21, (none) 14, .example 2)

## Summary
- 2257 nodes · 5803 edges · 106 communities (76 shown, 30 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `126cc9f7`
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
- budget-math.ts
- accounts.schemas.ts
- AccountsService
- compilerOptions
- test/helpers.ts
- dependencies
- debt-dialog.ts
- wipeIdentity
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- recurrence.ts
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
- e2e/helpers.ts
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
- CurrentUser
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- ledger.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- InstallmentsService
- notifications.module.ts
- TransactionsService
- redis
- BudgetPage
- healthcheck
- zod
- parseDecimalInput
- members.ts
- recurring-page.ts
- RecurringService
- toBase64
- backend/README.md
- Converter
- HouseholdRatesController
- debts.controller.ts
- KeyVaultService
- MembersService
- OnboardingPage
- home.ts
- RatesService
- GoalsService
- household.service.ts
- HouseholdService
- reminder-plan.ts
- HouseholdPage
- recover.ts
- key-update.ts
- PrismaService
- ngsw-config.json
- savings-math.ts
- card-statement.ts
- EsArDateAdapter
- RecurringPage
- migrate
- getSodium
- ProgressService
- PaymentDialog
- AutoLockService
- FakePush
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- RatesPage
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 71 edges
2. `@angular/core` - 68 edges
3. `PrismaService` - 66 edges
4. `parseDecimalInput()` - 53 edges
5. `KeyVaultService` - 42 edges
6. `@angular/common` - 41 edges
7. `@angular/material` - 39 edges
8. `@jsverse/transloco` - 39 edges
9. `toBase64()` - 36 edges
10. `getSodium()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `user()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/rates.e2e-spec.ts → backend/test/helpers.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `BudgetContext` --references--> `Transaction`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/transactions/transaction.model.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts

## Import Cycles
- None detected.

## Communities (106 total, 30 thin omitted)

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
Cohesion: 0.09
Nodes (22): dependencies, bullmq@^6.7.10, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1 (+14 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "budget-math.ts"
Cohesion: 0.15
Nodes (16): ratioOf(), BudgetContext, BudgetProgress, carriedInto(), computeBudget(), GROUP_SPLIT, GroupProgress, ItemProgress (+8 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.10
Nodes (11): AccountsController, uuid, CreateAccountInput, createAccountSchema, listQuerySchema, UpdateAccountInput, updateAccountSchema, AccountDto (+3 more)

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.17
Nodes (23): memberKeySignedMessage(), newUser(), payload(), payload(), setup(), payload(), setup(), b64() (+15 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0 (+16 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.05
Nodes (33): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+25 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "recurrence.ts"
Cohesion: 0.15
Nodes (13): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+5 more)

### Community 19 - "ledger.ts"
Cohesion: 0.19
Nodes (6): Transaction, TransactionDto, TransactionType, Page, SingleDraft, TransactionsService

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
Nodes (31): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, isoDate, collectDeposit, createDeposit, datesMsg (+23 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.07
Nodes (34): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+26 more)

### Community 29 - "rates.e2e-spec.ts"
Cohesion: 0.10
Nodes (13): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources, PublicRatesController (+5 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.08
Nodes (19): CurrenciesService, Currency, Frequency, formatMoney(), toInputValue(), CARD_NETWORKS, AccountsService, BudgetDialog (+11 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.07
Nodes (42): fromIsoDate(), monthOf(), todayIso(), toIsoDate(), compareDecimals(), isNegative(), normalize(), parseDecimalInput() (+34 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.09
Nodes (17): @nestjs/swagger@^12.1.2, AccountsModule, AppModule, BudgetsModule, CategoriesModule, DebtsModule, HouseholdsModule, InstallmentsModule (+9 more)

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
Cohesion: 0.09
Nodes (12): BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+4 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.10
Nodes (12): deleteQuerySchema, RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, postOccurrencesSchema (+4 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.13
Nodes (7): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService, toDto()

### Community 43 - "debts-page.ts"
Cohesion: 0.11
Nodes (27): Method, RequestBody, CreateAccount, CreateTransactions, MeHousehold, RegisterRequest, TokenResponse, HouseholdContextService (+19 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.05
Nodes (41): @angular/platform-browser@^22.3.0, license, name, packageManager, private, version, App, appConfig (+33 more)

### Community 46 - "ledger.ts"
Cohesion: 0.17
Nodes (17): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ARS, BTC, subDecimals(), toUnits() (+9 more)

### Community 47 - "BudgetsService"
Cohesion: 0.22
Nodes (6): Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 52 - "notifications.module.ts"
Cohesion: 0.07
Nodes (17): cookie-parser@^1.4.7, Env, envSchema, app, config, NotificationsModule, RemindersProcessor, RemindersScheduler (+9 more)

### Community 53 - "TransactionsService"
Cohesion: 0.08
Nodes (16): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+8 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "zod"
Cohesion: 0.11
Nodes (21): accountFields, accountTypeSchema, creditCardMessage, creditCardSchema, day, encryptedPayload, base64Bytes(), uuid (+13 more)

### Community 60 - "members.ts"
Cohesion: 0.18
Nodes (10): @nestjs/throttler@^6.8.0, accept, defaultHousehold, grant, invite, role, rotate, uuid (+2 more)

### Community 62 - "RecurringService"
Cohesion: 0.27
Nodes (5): RecurringRule, RuleDraft, RulePayload, RecurringService, scheduleOf()

### Community 63 - "toBase64"
Cohesion: 0.22
Nodes (9): toBase64(), toIsoDate(), paymentDto(), toDto(), assetDto(), priceDto(), tradeDto(), PostOccurrencesInput (+1 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "debts.controller.ts"
Cohesion: 0.12
Nodes (4): DebtsController, CreateDebtInput, CreatePaymentInput, DebtsService

### Community 68 - "KeyVaultService"
Cohesion: 0.15
Nodes (10): MeResponse, Identity, DEFAULT_KDF_PARAMS, KeyVaultService, UpdateKeysRequest, WrongRecoveryPhraseError, memberKeySignedMessage(), unwrapHouseholdKey() (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 74 - "household.service.ts"
Cohesion: 0.36
Nodes (3): HouseholdPayload, keyFingerprint(), Sodium

### Community 76 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "recover.ts"
Cohesion: 0.13
Nodes (11): byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), Recover, CURRENCIES, Register (+3 more)

### Community 79 - "key-update.ts"
Cohesion: 0.22
Nodes (12): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, concat(), KeyUpdateFields, keyUpdateSignedMessage() (+4 more)

### Community 80 - "PrismaService"
Cohesion: 0.08
Nodes (14): Item, CategoriesController, HouseholdAccess, HouseholdAccessService, createReminder, markRead, subscription, unsubscribe (+6 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

### Community 83 - "card-statement.ts"
Cohesion: 0.18
Nodes (17): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+9 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - "getSodium"
Cohesion: 0.18
Nodes (19): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF (+11 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "@nestjs/authentication"
Cohesion: 0.07
Nodes (18): AuthModule, AuthService, JwtAuth, verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR (+10 more)

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
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@jsverse/transloco` to `KeyVaultService`, `household.service.ts`, `debts-page.ts`, `dependencies`, `recover.ts`, `getSodium`, `debts-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `accounts.schemas.ts`, `test/helpers.ts`, `currencies.controller.ts`, `deposits.ts`, `rates.e2e-spec.ts`, `health.controller.ts`, `budgets/budgets.service.ts`, `recurring.schemas.ts`, `installments/installments.service.ts`, `notifications.module.ts`, `TransactionsService`, `zod`, `members.ts`, `toBase64`, `PrismaService`, `@nestjs/authentication`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `@jsverse/transloco`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._