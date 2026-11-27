# Graph Report - commit  (2026-11-26)

## Corpus Check
- 319 files · ~143,503 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 47 file(s) not represented in the graph (top: .scss 25, (none) 15, .example 2)

## Summary
- 2588 nodes · 6592 edges · 125 communities (86 shown, 39 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 184 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a3a975d3`
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
- debt-dialog.ts
- src/receipts/receipts.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- tools-math.ts
- TransactionsService
- backend-dev
- frontend
- environment
- services
- backend
- TransactionsPage
- volumes
- toBase64
- ReceiptsService
- rate-sources.ts
- debts-page.ts
- transactions-page.ts
- @nestjs/common
- ProgressController
- .require
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
- migrate
- frontend/package.json
- members.ts
- pick
- redis
- BudgetPage
- healthcheck
- DebtsPage
- account-dialog.ts
- src/transactions/transactions.service.ts
- article.model.ts
- recurring-page.ts
- identity.ts
- e2e/helpers.ts
- backend/README.md
- Converter
- RemindersService
- src/debts/debts.service.ts
- MeResponse
- MembersService
- session-keys.ts
- sodium.ts
- parseDecimalInput
- app.py
- EsArDateAdapter
- HouseholdService
- NotificationsService
- HouseholdPage
- crypto.spec.ts
- ChangePassphrase
- ReceiptsService
- ngsw-config.json
- card-cycle.ts
- plan-engine.ts
- articles.ts
- Recover
- RatesService
- key-vault.service.ts
- savings-page.ts
- version.ts
- progress-page.ts
- reminder-plan.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- RemindersScheduler
- Unlock
- services
- AuthService
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- ProgressService
- frontend-dev
- RatesScheduler
- landing.ts
- SubscriptionPage
- allowBuilds
- keyFingerprint
- WhatsappCard
- FakePush
- TestWhatsapp
- Login
- ArticlePage
- SettingsPage
- ThemeService
- .list

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
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (125 total, 39 thin omitted)

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
Cohesion: 0.08
Nodes (24): dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+16 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (45): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+37 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "progress-engine.ts"
Cohesion: 0.20
Nodes (16): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+8 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.08
Nodes (17): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+9 more)

### Community 9 - "AccountsService"
Cohesion: 0.16
Nodes (4): Account, AccountDraft, AccountsPage, toDraft()

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.12
Nodes (28): memberKeySignedMessage(), DueReminder, PrismaService, newUser(), payload(), payload(), setup(), payload() (+20 more)

### Community 12 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+19 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.13
Nodes (16): DebtDialog, fractionToPercent(), percentToFraction(), shiftPoint(), Amortization, Debt, DebtDraft, DebtDto (+8 more)

### Community 14 - "src/receipts/receipts.service.ts"
Cohesion: 0.07
Nodes (24): libsodium-wrappers@^0.8.4, Env, PushService, ExtractorService, OcrClient, GENERIC_CATEGORIES, money, ReceiptExtraction (+16 more)

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
Cohesion: 0.23
Nodes (4): Transaction, TransactionDto, Page, TransactionsService

### Community 20 - "backend-dev"
Cohesion: 0.20
Nodes (10): depends_on, depends_on, ports, profiles, volumes, migrate, redis, condition (+2 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.33
Nodes (13): environment, environment, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT (+5 more)

### Community 23 - "services"
Cohesion: 0.25
Nodes (8): x-backend-env, DATABASE_URL, JWT_SECRET, PORT, REDIS_URL, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY, VAPID_SUBJECT

### Community 24 - "backend"
Cohesion: 0.29
Nodes (10): build, build, profiles, restart, context, target, build, build (+2 more)

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 27 - "toBase64"
Cohesion: 0.04
Nodes (51): base64Bytes(), toBase64(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, isoDate, collectDeposit (+43 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.08
Nodes (4): extractMessages(), ReceiptsController, linkKey(), ReceiptsService

### Community 29 - "rate-sources.ts"
Cohesion: 0.08
Nodes (14): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+6 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.11
Nodes (19): CurrenciesService, Currency, formatMoney(), BudgetDialogData, shiftMonth(), estimateStatement(), card, plan (+11 more)

### Community 31 - "transactions-page.ts"
Cohesion: 0.07
Nodes (22): DATE_PROVIDERS, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), Frequency, toInputValue(), accountIcon() (+14 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.05
Nodes (29): cookie-parser@^1.4.7, @nestjs/swagger@^12.1.2, AccountsModule, AppModule, BudgetsModule, CategoriesModule, envSchema, CurrenciesController (+21 more)

### Community 34 - ".require"
Cohesion: 0.11
Nodes (4): dto(), GoalsService, HouseholdRatesController, HouseholdRatesService

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.13
Nodes (3): DepositsController, DepositsService, dto()

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.08
Nodes (14): deleteQuerySchema, BudgetsController, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema (+6 more)

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.09
Nodes (14): toIsoDate(), RecurringController, uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput (+6 more)

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.13
Nodes (4): InstallmentsController, CreatePlanInput, InstallmentsService, toDto()

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.09
Nodes (32): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, TokenResponse, KeyVaultService (+24 more)

### Community 45 - "@angular/core"
Cohesion: 0.08
Nodes (30): App, appConfig, NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard() (+22 more)

### Community 46 - "budget-math.ts"
Cohesion: 0.09
Nodes (41): addDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB (+33 more)

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

### Community 52 - "members.ts"
Cohesion: 0.20
Nodes (9): accept, defaultHousehold, grant, invite, role, rotate, uuid, wrapped (+1 more)

### Community 53 - "pick"
Cohesion: 0.14
Nodes (8): expense(), newDebt(), pick(), expense(), midPreviousMonth(), pastTransaction(), newRule(), newTransaction()

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 58 - "account-dialog.ts"
Cohesion: 0.19
Nodes (8): AccountDialog, CARD_NETWORKS, decimal(), ACCOUNT_TYPES, AccountDto, AccountPayload, AccountType, CreditCardPayload

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (21): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema (+13 more)

### Community 60 - "article.model.ts"
Cohesion: 0.27
Nodes (9): Block, Level, LEVELS, readingMinutes(), Topic, TOPICS, articleBySlug(), ARTICLES (+1 more)

### Community 62 - "identity.ts"
Cohesion: 0.27
Nodes (8): aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), openPrivateKeys(), sealAad(), SealContext

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.15
Nodes (9): createAccount(), nextIn(), readPhrase(), registerViaUi(), strip(), unlock(), safeDay, receipt (+1 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "src/debts/debts.service.ts"
Cohesion: 0.09
Nodes (13): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+5 more)

### Community 68 - "MeResponse"
Cohesion: 0.28
Nodes (3): MeResponse, Identity, WrongRecoveryPhraseError

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.18
Nodes (13): AutoLockService, b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity() (+5 more)

### Community 71 - "sodium.ts"
Cohesion: 0.24
Nodes (9): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8() (+1 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.07
Nodes (21): compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), optionalAmount(), amount(), PaymentDialog, positive() (+13 more)

### Community 73 - "app.py"
Cohesion: 0.21
Nodes (3): health(), read(), _texts()

### Community 78 - "crypto.spec.ts"
Cohesion: 0.16
Nodes (11): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), CURRENCIES, Register (+3 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "card-cycle.ts"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 83 - "plan-engine.ts"
Cohesion: 0.14
Nodes (11): monthlyRate(), simulatePayoff(), buildPlan(), effectiveRate(), pick(), PlanDebt, PlanInput, PlanResult (+3 more)

### Community 84 - "articles.ts"
Cohesion: 0.33
Nodes (6): Article, DEUDAS, INVERSION, ORDER, PAREJA, PERSONAL

### Community 88 - "key-vault.service.ts"
Cohesion: 0.17
Nodes (20): RegistrationForm, RegistrationService, generateIdentity(), sealPrivateKeys(), DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), kdfWorker() (+12 more)

### Community 89 - "savings-page.ts"
Cohesion: 0.15
Nodes (17): NUMBER_LOCALE, DepositDialog, optional(), positive(), toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings() (+9 more)

### Community 91 - "progress-page.ts"
Cohesion: 0.22
Nodes (5): PLAN_ARTICLE, TIP_ARTICLE, ScoreComponent, LEVEL_ICONS, ProgressPage

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
Nodes (19): AuthModule, RegisterInput, AuthService, JwtAuth, verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed() (+11 more)

### Community 99 - "services"
Cohesion: 0.25
Nodes (7): name, build, ports, profiles, restart, services, ocr

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

### Community 108 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 110 - "landing.ts"
Cohesion: 0.40
Nodes (3): FEATURED, FEATURES, Landing

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `src/debts/debts.service.ts`, `accounts.schemas.ts`, `budgets/budgets.service.ts`, `health.controller.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `recurring.schemas.ts`, `src/receipts/receipts.service.ts`, `src/transactions/transactions.service.ts`, `members.ts`, `toBase64`, `rate-sources.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.07071887784921099 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `parseDecimalInput`, `features/recurring/recurring.service.ts`, `dependencies`, `debt-dialog.ts`, `crypto.spec.ts`, `landing.ts`, `tools-math.ts`, `frontend/package.json`, `key-vault.service.ts`, `savings-page.ts`, `account-dialog.ts`, `progress-page.ts`, `article.model.ts`, `debts-page.ts`, `transactions-page.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `pick`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._