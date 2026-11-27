# Graph Report - commit  (2026-11-26)

## Corpus Check
- 325 files · ~146,158 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 48 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2648 nodes · 6719 edges · 127 communities (87 shown, 40 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 185 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3d19f8bf`
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
- progress-engine.ts
- accounts.schemas.ts
- AccountsService
- compilerOptions
- test/helpers.ts
- dependencies
- debt-math.ts
- @nestjs/common
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- tools-math.ts
- TransactionsService
- backend-dev
- frontend
- environment
- x-backend-env
- backend
- TransactionsPage
- receipts.controller.ts
- deposits.ts
- ReceiptsService
- rates.module.ts
- rates-page.ts
- transactions-page.ts
- app.module.ts
- ProgressController
- .create
- recommend.ts
- DepositsService
- DepositsService
- health.controller.ts
- CurrentUser
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
- recurrence.ts
- frontend/package.json
- ledger.ts
- frontend/package.json
- redis
- BudgetPage
- InstallmentsService
- UsersRepository
- Register
- src/transactions/transactions.service.ts
- articles.ts
- recurring-page.ts
- payloadAad
- e2e/helpers.ts
- backend/README.md
- Converter
- accounts.schemas.ts
- DebtsController
- key-vault.service.ts
- MembersService
- session-keys.ts
- sodium.ts
- parseDecimalInput
- app.py
- addDecimals
- HouseholdService
- NotificationsService
- HouseholdPage
- crypto.spec.ts
- backend/package.json
- ReceiptsService
- ngsw-config.json
- card-cycle.ts
- registration.service.ts
- TransactionsController
- StatusService
- getSodium
- savings-math.ts
- version.ts
- .require
- adminer
- AccountsPage
- Frontend
- me.controller.ts
- GoalsService
- OnboardingPage
- services
- fromBase64
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- PlanPage
- frontend-dev
- StatusPage
- TradeDialog
- SubscriptionPage
- allowBuilds
- backend
- AutoLockService
- typescript@^6.0.2
- @angular/cdk@22.3.0
- Login
- Body
- SettingsPage
- ThemeService
- @fontsource/roboto@5.3.0
- .require
- @scure/bip39

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 83 edges
2. `@angular/core` - 83 edges
3. `PrismaService` - 71 edges
4. `parseDecimalInput()` - 57 edges
5. `@angular/material` - 51 edges
6. `@jsverse/transloco` - 51 edges
7. `@angular/common` - 47 edges
8. `KeyVaultService` - 45 edges
9. `@angular/router` - 41 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `WhatsappClient` --references--> `Env`  [EXTRACTED]
  backend/src/receipts/whatsapp.client.ts → backend/src/config/env.schema.ts
- `BudgetContext` --references--> `Transaction`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/transactions/transaction.model.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts
- `SealedReceipt` --references--> `ReceiptExtraction`  [EXTRACTED]
  backend/src/receipts/receipts.service.ts → backend/src/receipts/receipt.schema.ts

## Import Cycles
- None detected.

## Communities (127 total, 40 thin omitted)

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
Nodes (25): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1 (+17 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), redis

### Community 7 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.07
Nodes (19): AccountsController, uuid, AccountsModule, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage (+11 more)

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.12
Nodes (27): memberKeySignedMessage(), PrismaService, newUser(), payload(), payload(), setup(), payload(), setup() (+19 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (15): dependencies, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0, @angular/service-worker@^22.3.0, @jsverse/transloco@8.4.0 (+7 more)

### Community 13 - "debt-math.ts"
Cohesion: 0.05
Nodes (34): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+26 more)

### Community 14 - "@nestjs/common"
Cohesion: 0.10
Nodes (20): libsodium-wrappers@^0.8.4, Env, NotificationsModule, PushService, DueReminder, ExtractorService, OcrClient, GENERIC_CATEGORIES (+12 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.11
Nodes (16): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+8 more)

### Community 17 - "RecurringService"
Cohesion: 0.10
Nodes (8): PendingList, PendingOccurrence, RecurringRule, RuleDraft, RecurringPage, firstOnOrAfter(), RecurringService, scheduleOf()

### Community 18 - "tools-math.ts"
Cohesion: 0.07
Nodes (35): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+27 more)

### Community 19 - "TransactionsService"
Cohesion: 0.23
Nodes (4): Transaction, TransactionDto, Page, TransactionsService

### Community 20 - "backend-dev"
Cohesion: 0.15
Nodes (13): depends_on, ports, profiles, volumes, postgres, redis, depends_on, profiles (+5 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.23
Nodes (22): environment, environment, ANTHROPIC_API_KEY, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV (+14 more)

### Community 23 - "x-backend-env"
Cohesion: 0.12
Nodes (17): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET, OCR_URL, PORT, REDIS_URL, STATUS_TOKEN (+9 more)

### Community 24 - "backend"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "receipts.controller.ts"
Cohesion: 0.08
Nodes (13): extractMessages(), IncomingMessage, linkSchema, planSchema, WhatsappWebhookController, fmt(), ReceiptJob, RECEIPTS_QUEUE (+5 more)

### Community 27 - "deposits.ts"
Cohesion: 0.04
Nodes (55): CategoriesController, CategoriesModule, encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit (+47 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.10
Nodes (3): ReceiptsController, linkKey(), ReceiptsService

### Community 29 - "rates.module.ts"
Cohesion: 0.08
Nodes (17): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+9 more)

### Community 30 - "rates-page.ts"
Cohesion: 0.13
Nodes (5): RatesPage, RELEVANT, USD_TYPES, ManualRate, RatesService

### Community 31 - "transactions-page.ts"
Cohesion: 0.19
Nodes (6): DATE_PROVIDERS, EsArDateAdapter, DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES, TRANSACTIONS_ROUTES

### Community 32 - "app.module.ts"
Cohesion: 0.07
Nodes (18): cookie-parser@^1.4.7, @nestjs/swagger@^12.1.2, AppModule, AuthModule, envSchema, CurrenciesController, CurrenciesModule, app (+10 more)

### Community 34 - ".create"
Cohesion: 0.12
Nodes (3): HouseholdRatesController, HouseholdRatesService, PublicRatesController

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.13
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (6): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.08
Nodes (14): BudgetsController, uuid, BudgetsModule, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema (+6 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.10
Nodes (12): revision, RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput (+4 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.11
Nodes (9): isoDate, InstallmentsController, uuid, InstallmentsModule, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService (+1 more)

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.11
Nodes (23): Method, RequestBody, CreateAccount, CreateTransactions, KeyVaultService, HouseholdContextService, OfflineCacheService, Installment (+15 more)

### Community 45 - "@angular/core"
Cohesion: 0.05
Nodes (41): App, appConfig, NAV, NavItem, routes, RegisterRequest, TokenResponse, authInterceptor() (+33 more)

### Community 46 - "budget-math.ts"
Cohesion: 0.16
Nodes (15): BudgetContext, BudgetProgress, carriedInto(), computeBudget(), GROUP_SPLIT, GroupProgress, ItemProgress, ItemStatus (+7 more)

### Community 47 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "recurrence.ts"
Cohesion: 0.18
Nodes (14): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+6 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (18): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+10 more)

### Community 52 - "ledger.ts"
Cohesion: 0.18
Nodes (12): negateDecimal(), AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount() (+4 more)

### Community 53 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): @angular/compiler@^22.3.0, @angular/platform-browser@^22.3.0, material-symbols@0.49.0, license, name, packageManager, private, version (+3 more)

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 57 - "UsersRepository"
Cohesion: 0.14
Nodes (7): AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect, UsersRepository

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (22): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, TransactionsModule, CreateTransactionsInput (+14 more)

### Community 60 - "articles.ts"
Cohesion: 0.12
Nodes (20): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+12 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.09
Nodes (17): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+9 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "DebtsController"
Cohesion: 0.09
Nodes (12): DebtsController, uuid, DebtsModule, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields (+4 more)

### Community 68 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (10): HouseholdPayload, MeHousehold, UpdateKeysRequest, WrongPassphraseError, WrongRecoveryPhraseError, SessionService, CURRENCIES, Invitation (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.28
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 71 - "sodium.ts"
Cohesion: 0.33
Nodes (8): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8()

### Community 72 - "parseDecimalInput"
Cohesion: 0.06
Nodes (56): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), compareDecimals(), formatMoney() (+48 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "addDecimals"
Cohesion: 0.17
Nodes (16): addDecimals(), fromUnits(), percentOf(), ratioOf(), BTC, PAB, USD, subDecimals() (+8 more)

### Community 78 - "crypto.spec.ts"
Cohesion: 0.18
Nodes (12): FAST_KDF, generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey(), byFolded, fold(), generateRecoveryPhrase() (+4 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "card-cycle.ts"
Cohesion: 0.32
Nodes (10): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), shiftMonth() (+2 more)

### Community 83 - "registration.service.ts"
Cohesion: 0.20
Nodes (11): RegistrationForm, RegistrationService, DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker(), pending, randomSalt() (+3 more)

### Community 87 - "StatusService"
Cohesion: 0.15
Nodes (3): StatusController, probe(), StatusService

### Community 88 - "getSodium"
Cohesion: 0.25
Nodes (12): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), keyFingerprint(), generateIdentity(), openPrivateKeys(), sealAad() (+4 more)

### Community 89 - "savings-math.ts"
Cohesion: 0.28
Nodes (12): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+4 more)

### Community 92 - ".require"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "me.controller.ts"
Cohesion: 0.11
Nodes (9): KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, updateKeysSchema, KeysService, MeController (+1 more)

### Community 99 - "services"
Cohesion: 0.13
Nodes (14): name, build, ports, profiles, restart, services, ocr, volumes (+6 more)

### Community 100 - "fromBase64"
Cohesion: 0.42
Nodes (3): MeResponse, Identity, fromBase64()

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

### Community 108 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 110 - "TradeDialog"
Cohesion: 0.33
Nodes (4): TradeDialog, AssetClass, TradeType, InvestmentsDto

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - "backend"
Cohesion: 0.33
Nodes (6): depends_on, profiles, restart, migrate, condition, backend

### Community 124 - ".require"
Cohesion: 0.13
Nodes (10): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), assetDto(), priceDto(), tradeDto() (+2 more)

## Knowledge Gaps
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `app.module.ts`, `me.controller.ts`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `DebtsController`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `health.controller.ts`, `test/helpers.ts`, `installments/installments.service.ts`, `recurring.schemas.ts`, `src/transactions/transactions.service.ts`, `UsersRepository`, `receipts.controller.ts`, `deposits.ts`, `rates.module.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `key-vault.service.ts`, `parseDecimalInput`, `features/recurring/recurring.service.ts`, `dependencies`, `tools-math.ts`, `registration.service.ts`, `frontend/package.json`, `articles.ts`, `rates-page.ts`, `transactions-page.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `frontend/package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._