# Graph Report - commit  (2026-11-26)

## Corpus Check
- 327 files · ~146,536 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 48 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2654 nodes · 6739 edges · 129 communities (80 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 185 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `998a3426`
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
- AccountsService
- AccountsService
- compilerOptions
- test/helpers.ts
- dependencies
- Debt
- src/receipts/receipts.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @angular/forms
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
- rate-sources.ts
- RatesService
- EsArDateAdapter
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
- backend/package.json
- BudgetsService
- nest-cli.dev.json
- scripts
- DebtsController
- frontend/package.json
- debt-math.ts
- App
- redis
- BudgetPage
- card-cycle.ts
- core/auth/auth.service.ts
- recover.ts
- src/transactions/transactions.service.ts
- articles.ts
- recurring-page.ts
- DebtsService
- e2e/helpers.ts
- backend/README.md
- Converter
- plan-engine.ts
- .require
- debt.model.ts
- MembersService
- session-keys.ts
- sodium.ts
- parseDecimalInput
- app.py
- decimal.ts
- HouseholdService
- RatesService
- HouseholdPage
- getSodium
- backend/package.json
- ReceiptsService
- ngsw-config.json
- AccountsPage
- default-categories.ts
- crypto.spec.ts
- PlanPage
- keyFingerprint
- savings-page.ts
- version.ts
- .require
- adminer
- AccountsPage
- Frontend
- members.ts
- GoalsService
- PaymentDialog
- services
- fromBase64
- .oxlintrc.json
- CurrenciesController
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- PlanPage
- frontend-dev
- StatusPage
- Unlock
- SubscriptionPage
- allowBuilds
- backend
- AutoLockService
- typescript@^6.0.2
- WhatsappCard
- Login
- libsodium-wrappers-sumo
- SettingsPage
- ThemeService
- @types/cookie-parser@^1.4.10
- @types/node@^24.0.0
- vitest@^4.1.2
- @vitest/coverage-v8@^4.1.2
- @angular/compiler@^22.3.0

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 84 edges
2. `@nestjs/common` - 83 edges
3. `PrismaService` - 71 edges
4. `parseDecimalInput()` - 57 edges
5. `@jsverse/transloco` - 52 edges
6. `@angular/material` - 52 edges
7. `@angular/common` - 47 edges
8. `KeyVaultService` - 45 edges
9. `@angular/router` - 41 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `Debt` --references--> `Amortization`  [EXTRACTED]
  frontend/src/app/features/debts/debt.model.ts → frontend/src/app/features/debts/debt-math.ts
- `PlanDebt` --references--> `RateType`  [EXTRACTED]
  frontend/src/app/features/plan/plan-engine.ts → frontend/src/app/features/debts/debt.model.ts

## Import Cycles
- None detected.

## Communities (129 total, 49 thin omitted)

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
Cohesion: 0.07
Nodes (27): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1 (+19 more)

### Community 4 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, @nestjs/cli@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0, oxlint-tsgolint@^7.0.2001, prettier@^3.4.2, source-map-support@^0.5.21, supertest@^7.0.0 (+14 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (7): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), redis, @nestjs/authentication

### Community 7 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 8 - "AccountsService"
Cohesion: 0.08
Nodes (17): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+9 more)

### Community 9 - "AccountsService"
Cohesion: 0.13
Nodes (13): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon() (+5 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.13
Nodes (27): memberKeySignedMessage(), PrismaService, newUser(), payload(), payload(), setup(), payload(), setup() (+19 more)

### Community 12 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0, @angular/service-worker@^22.3.0 (+11 more)

### Community 13 - "Debt"
Cohesion: 0.16
Nodes (3): Debt, DebtPayload, DebtsPage

### Community 14 - "src/receipts/receipts.service.ts"
Cohesion: 0.07
Nodes (17): Env, RemindersProcessor, PushService, DueReminder, RemindersService, ExtractorService, OcrClient, REDIS (+9 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.11
Nodes (16): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+8 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 18 - "@angular/forms"
Cohesion: 0.07
Nodes (35): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+27 more)

### Community 19 - "TransactionsService"
Cohesion: 0.19
Nodes (6): Transaction, TransactionDto, TransactionType, Page, SingleDraft, TransactionsService

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
Nodes (17): GENERIC_CATEGORIES, money, receiptExtractionSchema, extractMessages(), IncomingMessage, linkSchema, planSchema, WhatsappWebhookController (+9 more)

### Community 27 - "deposits.ts"
Cohesion: 0.06
Nodes (40): base64Bytes(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg (+32 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.09
Nodes (5): ReceiptExtraction, ReceiptsController, linkKey(), ReceiptsService, SealedReceipt

### Community 29 - "rate-sources.ts"
Cohesion: 0.08
Nodes (15): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+7 more)

### Community 32 - "app.module.ts"
Cohesion: 0.04
Nodes (28): @nestjs/swagger@^12.1.2, AccountsModule, AppModule, BudgetsModule, CategoriesModule, envSchema, CurrenciesModule, DebtsModule (+20 more)

### Community 34 - ".create"
Cohesion: 0.12
Nodes (3): HouseholdRatesController, HouseholdRatesService, PublicRatesController

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.09
Nodes (13): deleteQuerySchema, BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema (+5 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.09
Nodes (14): isoDate, RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput (+6 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.07
Nodes (9): CategoriesController, HouseholdAccessService, HouseholdsModule, InstallmentsController, uuid, CreatePlanInput, createPlanSchema, InstallmentsService (+1 more)

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.11
Nodes (30): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, KeyVaultService, UpdateKeysRequest (+22 more)

### Community 45 - "@angular/core"
Cohesion: 0.05
Nodes (49): NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard(), landingGuard(), remember() (+41 more)

### Community 46 - "backend/package.json"
Cohesion: 0.11
Nodes (17): author, libsodium-wrappers@^0.8.4, description, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @types/express@^5.0.0, @types/web-push@^3.6.4, license (+9 more)

### Community 47 - "BudgetsService"
Cohesion: 0.10
Nodes (12): BudgetDialog, BudgetContext, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem (+4 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 52 - "debt-math.ts"
Cohesion: 0.24
Nodes (12): amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt (+4 more)

### Community 53 - "App"
Cohesion: 0.29
Nodes (4): @angular/platform-browser@^22.3.0, App, appConfig, @angular/platform-browser

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "card-cycle.ts"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 57 - "core/auth/auth.service.ts"
Cohesion: 0.20
Nodes (4): RegisterRequest, TokenResponse, AuthService, isNetworkError()

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (22): revision, SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput (+14 more)

### Community 60 - "articles.ts"
Cohesion: 0.13
Nodes (18): Article, Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, ArticlePage (+10 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.09
Nodes (17): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+9 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 66 - "plan-engine.ts"
Cohesion: 0.29
Nodes (7): buildPlan(), effectiveRate(), pick(), PlanDebt, PlanInput, PlanResult, round2()

### Community 67 - ".require"
Cohesion: 0.11
Nodes (18): toBase64(), toIsoDate(), uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields (+10 more)

### Community 68 - "debt.model.ts"
Cohesion: 0.25
Nodes (9): DebtDialog, Amortization, DebtDto, DebtKind, DebtPayment, DebtStatus, PaymentDraft, PaymentPayload (+1 more)

### Community 69 - "MembersService"
Cohesion: 0.09
Nodes (12): verifyEd25519(), accept, defaultHousehold, grant, hashToken(), invite, MembersController, MembersService (+4 more)

### Community 70 - "session-keys.ts"
Cohesion: 0.33
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 71 - "sodium.ts"
Cohesion: 0.20
Nodes (13): DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, concat(), KeyUpdateFields (+5 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.05
Nodes (38): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), formatMoney(), normalize() (+30 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "decimal.ts"
Cohesion: 0.09
Nodes (42): addDecimals(), compareDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), BTC (+34 more)

### Community 78 - "getSodium"
Cohesion: 0.15
Nodes (20): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), generateIdentity() (+12 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 86 - "crypto.spec.ts"
Cohesion: 0.21
Nodes (10): @scure/bip39@^2.4.0, FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord() (+2 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.10
Nodes (24): NUMBER_LOCALE, AmountDialog, AmountDialogData, AmountDialogResult, amountValidator(), optional(), positive(), TradeDialog (+16 more)

### Community 92 - ".require"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "members.ts"
Cohesion: 0.06
Nodes (17): AuthModule, AuthService, JwtAuth, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput (+9 more)

### Community 99 - "services"
Cohesion: 0.13
Nodes (14): name, build, ports, profiles, restart, services, ocr, volumes (+6 more)

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

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - "backend"
Cohesion: 0.33
Nodes (6): depends_on, profiles, restart, migrate, condition, backend

## Knowledge Gaps
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `src/receipts/receipts.service.ts` to `app.module.ts`, `members.ts`, `dependencies`, `.require`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `health.controller.ts`, `AccountsService`, `budgets/budgets.service.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `MembersService`, `recurring.schemas.ts`, `backend/package.json`, `src/transactions/transactions.service.ts`, `receipts.controller.ts`, `deposits.ts`, `rate-sources.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `savings-page.ts`, `parseDecimalInput`, `AccountsService`, `decimal.ts`, `features/recurring/recurring.service.ts`, `dependencies`, `getSodium`, `@angular/forms`, `frontend/package.json`, `core/auth/auth.service.ts`, `articles.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@angular/material` connect `@angular/core` to `parseDecimalInput`, `AccountsService`, `decimal.ts`, `features/recurring/recurring.service.ts`, `dependencies`, `@angular/forms`, `frontend/package.json`, `savings-page.ts`, `articles.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._