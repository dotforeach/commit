# Graph Report - commit  (2026-11-26)

## Corpus Check
- 319 files · ~143,533 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 47 file(s) not represented in the graph (top: .scss 25, (none) 15, .example 2)

## Summary
- 2607 nodes · 6625 edges · 119 communities (82 shown, 37 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 184 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f1ed583`
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
- RatesService
- deposits.ts
- ReceiptsService
- rates.controller.ts
- debts-page.ts
- transactions-page.ts
- PrismaService
- ProgressController
- recommend.ts
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
- recurring-page.ts
- frontend/package.json
- ledger.ts
- frontend/package.json
- redis
- BudgetPage
- InstallmentsService
- budget-math.spec.ts
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
- OnboardingPage
- app.py
- libsodium-wrappers-sumo
- HouseholdService
- NotificationsService
- HouseholdPage
- crypto.spec.ts
- backend/package.json
- ReceiptsService
- ngsw-config.json
- card-cycle.ts
- vitest@^5.0.0
- TransactionsController
- debt-math.ts
- key-vault.service.ts
- savings-page.ts
- version.ts
- .require
- adminer
- AccountsPage
- Frontend
- prisma.service.ts
- GoalsService
- services
- percentToFraction
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- PlanPage
- frontend-dev
- SubscriptionPage
- allowBuilds
- typescript@^6.0.2
- Login
- Body
- SettingsPage
- ThemeService
- .require

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 82 edges
2. `@nestjs/common` - 79 edges
3. `PrismaService` - 69 edges
4. `parseDecimalInput()` - 57 edges
5. `@angular/material` - 50 edges
6. `@jsverse/transloco` - 50 edges
7. `@angular/common` - 46 edges
8. `KeyVaultService` - 45 edges
9. `@angular/router` - 41 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `WhatsappClient` --references--> `Env`  [EXTRACTED]
  backend/src/receipts/whatsapp.client.ts → backend/src/config/env.schema.ts
- `SealedReceipt` --references--> `ReceiptExtraction`  [EXTRACTED]
  backend/src/receipts/receipts.service.ts → backend/src/receipts/receipt.schema.ts
- `BudgetContext` --references--> `Transaction`  [EXTRACTED]
  frontend/src/app/features/budget/budget-math.ts → frontend/src/app/features/transactions/transaction.model.ts

## Import Cycles
- None detected.

## Communities (119 total, 37 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.07
Nodes (16): TradeDialog, Asset, AssetClass, Contribution, Deposit, DepositPayload, Goal, GoalDraft (+8 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2 (+22 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (7): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), redis, ioredis

### Community 7 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.13
Nodes (5): AccountsController, CreateAccountInput, listQuerySchema, AccountsService, toDto()

### Community 9 - "AccountsService"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.14
Nodes (26): newUser(), payload(), payload(), setup(), payload(), setup(), b64(), buildRegistration() (+18 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0, @angular/router@^22.3.0 (+9 more)

### Community 13 - "debt-math.ts"
Cohesion: 0.05
Nodes (33): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+25 more)

### Community 14 - "@nestjs/common"
Cohesion: 0.06
Nodes (34): AppModule, AuthModule, Env, envSchema, CurrenciesModule, app, config, NotificationsModule (+26 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.11
Nodes (16): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+8 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (18): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+10 more)

### Community 18 - "tools-math.ts"
Cohesion: 0.07
Nodes (35): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+27 more)

### Community 19 - "TransactionsService"
Cohesion: 0.19
Nodes (6): Transaction, TransactionDto, TransactionType, Page, SingleDraft, TransactionsService

### Community 20 - "backend-dev"
Cohesion: 0.12
Nodes (16): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+8 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.24
Nodes (21): environment, environment, ANTHROPIC_API_KEY, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV (+13 more)

### Community 23 - "x-backend-env"
Cohesion: 0.12
Nodes (16): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, JWT_SECRET, OCR_URL, PORT, REDIS_URL, SUBSCRIPTIONS_ENFORCED (+8 more)

### Community 24 - "backend"
Cohesion: 0.29
Nodes (10): build, build, context, target, build, build, build, profiles (+2 more)

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "RatesService"
Cohesion: 0.14
Nodes (5): HouseholdRatesController, PublicRatesController, RatesProcessor, RatesService, ratesToday()

### Community 27 - "deposits.ts"
Cohesion: 0.03
Nodes (72): uuid, AccountsModule, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day (+64 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.05
Nodes (12): ReceiptExtraction, extractMessages(), ReceiptsController, WhatsappWebhookController, fmt(), ReceiptJob, ReceiptsProcessor, linkKey() (+4 more)

### Community 29 - "rates.controller.ts"
Cohesion: 0.15
Nodes (10): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+2 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.09
Nodes (17): CurrenciesService, Currency, formatMoney(), isNegative(), CARD_NETWORKS, decimal(), AccountsService, BudgetDialogData (+9 more)

### Community 31 - "transactions-page.ts"
Cohesion: 0.12
Nodes (12): DATE_PROVIDERS, EsArDateAdapter, fromIsoDate(), monthOf(), accountIcon(), DEBTS_ROUTES, RECURRING_ROUTES, SAVINGS_ROUTES (+4 more)

### Community 32 - "PrismaService"
Cohesion: 0.07
Nodes (11): CurrenciesController, HouseholdAccessService, NotificationsController, PrismaService, milestone, onboarding, ProgressModule, score (+3 more)

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.12
Nodes (4): BudgetsController, CreateBudgetInput, UpdateBudgetInput, toDto()

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.11
Nodes (11): RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema (+3 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.18
Nodes (3): InstallmentsController, InstallmentsService, toDto()

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.10
Nodes (28): Method, RequestBody, CreateAccount, CreateTransactions, KeyVaultService, HouseholdContextService, isNetworkError(), OfflineCacheService (+20 more)

### Community 45 - "@angular/core"
Cohesion: 0.07
Nodes (33): App, appConfig, NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard() (+25 more)

### Community 46 - "budget-math.ts"
Cohesion: 0.17
Nodes (21): addDecimals(), fromUnits(), percentOf(), ratioOf(), BTC, PAB, USD, subDecimals() (+13 more)

### Community 47 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "recurring-page.ts"
Cohesion: 0.18
Nodes (5): Frequency, CategoriesService, RuleDto, RulePayload, RuleDialog

### Community 51 - "frontend/package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+8 more)

### Community 52 - "ledger.ts"
Cohesion: 0.23
Nodes (9): negateDecimal(), AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount() (+1 more)

### Community 53 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): @angular/compiler@^22.3.0, @fontsource/roboto@5.3.0, tslib@^2.3.0, license, name, packageManager, private, version (+3 more)

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 57 - "budget-math.spec.ts"
Cohesion: 0.32
Nodes (4): BudgetContext, cat(), ctx(), Category

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 60 - "articles.ts"
Cohesion: 0.12
Nodes (20): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+12 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.10
Nodes (17): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+9 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "DebtsController"
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (10): HouseholdPayload, MeHousehold, MeResponse, keyFingerprint(), Identity, DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.14
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.18
Nodes (13): AutoLockService, b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity() (+5 more)

### Community 71 - "sodium.ts"
Cohesion: 0.18
Nodes (13): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, concat(), KeyUpdateFields, keyUpdateSignedMessage() (+5 more)

### Community 72 - "OnboardingPage"
Cohesion: 0.07
Nodes (28): todayIso(), toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), toInputValue(), optionalAmount() (+20 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "card-cycle.ts"
Cohesion: 0.23
Nodes (16): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+8 more)

### Community 88 - "key-vault.service.ts"
Cohesion: 0.15
Nodes (21): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), generateIdentity(), openPrivateKeys() (+13 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.13
Nodes (21): NUMBER_LOCALE, THOUSANDS, ZERO, ICONS, LINKS, lastFullMonths(), AmountDialog, AmountDialogData (+13 more)

### Community 92 - ".require"
Cohesion: 0.22
Nodes (7): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders(), ReminderPlannerService

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "prisma.service.ts"
Cohesion: 0.05
Nodes (29): RegisterInput, AuthService, JwtAuth, memberKeySignedMessage(), verifyEd25519(), accept, defaultHousehold, grant (+21 more)

### Community 99 - "services"
Cohesion: 0.13
Nodes (14): name, build, ports, profiles, restart, services, ocr, volumes (+6 more)

### Community 100 - "percentToFraction"
Cohesion: 0.25
Nodes (3): RegisterRequest, TokenResponse, AuthService

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

### Community 124 - ".require"
Cohesion: 0.15
Nodes (10): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), assetDto(), priceDto(), tradeDto() (+2 more)

## Knowledge Gaps
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `prisma.service.ts`, `PrismaService`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `DebtsController`, `health.controller.ts`, `recurring.schemas.ts`, `src/transactions/transactions.service.ts`, `test/helpers.ts`, `deposits.ts`, `rates.controller.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.06892655367231638 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `key-vault.service.ts`, `OnboardingPage`, `features/recurring/recurring.service.ts`, `dependencies`, `recurring-page.ts`, `tools-math.ts`, `frontend/package.json`, `key-vault.service.ts`, `savings-page.ts`, `articles.ts`, `debts-page.ts`, `transactions-page.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `frontend/package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._