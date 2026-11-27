# Graph Report - commit  (2026-11-26)

## Corpus Check
- 263 files · ~112,110 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .scss 20, (none) 14, .example 2)

## Summary
- 2220 nodes · 5677 edges · 101 communities (78 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a67c64f1`
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
- key-vault.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
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
- TransactionsController
- debts-page.ts
- parseDecimalInput
- zod
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- DepositsService
- health.controller.ts
- CurrentUser
- budgets/budgets.service.ts
- RecurringController
- src/recurring/recurring.service.ts
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- ledger.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- InstallmentsService
- toBase64
- TransactionsService
- redis
- BudgetPage
- healthcheck
- goals.ts
- parseDecimalInput
- zod
- recurring-page.ts
- frontend/package.json
- toBase64
- backend/README.md
- Converter
- debts.controller.ts
- KeyVaultService
- MembersService
- onboarding-page.ts
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
- openapi.ts
- card-statement.ts
- EsArDateAdapter
- migrate
- getSodium
- version.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- RatesPage
- .oxlintrc.json
- RedisModule
- allowBuilds
- nest-cli.json
- dotenv
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
9. `getSodium()` - 36 edges
10. `toBase64()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `optionalAmount()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/budget/budget-dialog/budget-dialog.ts → frontend/src/app/core/money/decimal.ts
- `amountOrEmpty()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/onboarding/onboarding-page.ts → frontend/src/app/core/money/decimal.ts
- `RuleDialog` --references--> `Frequency`  [EXTRACTED]
  frontend/src/app/features/recurring/rule-dialog/rule-dialog.ts → frontend/src/app/core/dates/recurrence.ts

## Import Cycles
- None detected.

## Communities (101 total, 23 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.06
Nodes (32): TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection() (+24 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1 (+16 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (43): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, oxlint@^1.58.0, oxlint-tsgolint@^7.0.2001 (+35 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.11
Nodes (16): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+8 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "budget-math.ts"
Cohesion: 0.13
Nodes (24): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), ARS, BTC, subDecimals() (+16 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (3): AccountsController, AccountsService, toDto()

### Community 9 - "AccountsService"
Cohesion: 0.09
Nodes (14): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon() (+6 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.07
Nodes (40): @nestjs/testing@^12.0.1, AppModule, memberKeySignedMessage(), coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid() (+32 more)

### Community 12 - "dependencies"
Cohesion: 0.07
Nodes (26): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+18 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.07
Nodes (25): DebtDialog, Amortization, amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow (+17 more)

### Community 14 - "key-vault.service.ts"
Cohesion: 0.17
Nodes (9): keyFingerprint(), openPrivateKeys(), sealAad(), SealContext, wipeIdentity(), DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError (+1 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (21): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+13 more)

### Community 19 - "ledger.ts"
Cohesion: 0.23
Nodes (4): Transaction, TransactionDto, Page, TransactionsService

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
Cohesion: 0.07
Nodes (23): encryptedPayload, keyVersion, LinkedTransaction, isoDate, collectDeposit, createDeposit, datesMsg, DepositsModule (+15 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.14
Nodes (14): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+6 more)

### Community 29 - "TransactionsController"
Cohesion: 0.11
Nodes (19): revision, SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema (+11 more)

### Community 30 - "debts-page.ts"
Cohesion: 0.13
Nodes (15): CurrenciesService, Currency, monthOf(), formatMoney(), isNegative(), BudgetDialogData, optionalAmount(), CategoriesService (+7 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.08
Nodes (28): fromIsoDate(), toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), toInputValue(), amount() (+20 more)

### Community 32 - "zod"
Cohesion: 0.08
Nodes (12): AccountsModule, BudgetsModule, CategoriesController, DebtsModule, HouseholdAccess, HouseholdsModule, InstallmentsController, uuid (+4 more)

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
Cohesion: 0.14
Nodes (3): BudgetsController, BudgetsService, toDto()

### Community 42 - "src/recurring/recurring.service.ts"
Cohesion: 0.23
Nodes (10): uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema, ruleFields (+2 more)

### Community 43 - "debts-page.ts"
Cohesion: 0.11
Nodes (24): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdContextService, isNetworkError(), OfflineCacheService, SessionService (+16 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.06
Nodes (31): App, appConfig, NAV, NavItem, routes, authInterceptor(), authGuard(), guestGuard() (+23 more)

### Community 46 - "ledger.ts"
Cohesion: 0.23
Nodes (9): AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount(), totalsByCurrency() (+1 more)

### Community 47 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 52 - "toBase64"
Cohesion: 0.05
Nodes (27): CategoriesModule, Env, envSchema, app, config, NotificationsModule, RemindersScheduler, DueReminder (+19 more)

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
Cohesion: 0.14
Nodes (15): uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema, day (+7 more)

### Community 60 - "zod"
Cohesion: 0.06
Nodes (27): @nestjs/throttler@^6.8.0, uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput (+19 more)

### Community 62 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 63 - "toBase64"
Cohesion: 0.12
Nodes (18): toBase64(), linkedTransaction, toIsoDate(), paymentDto(), toDto(), dto(), toDto(), assetClass (+10 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "debts.controller.ts"
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "KeyVaultService"
Cohesion: 0.21
Nodes (5): MeResponse, Identity, KeyVaultService, fromBase64(), toBase64()

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 70 - "onboarding-page.ts"
Cohesion: 0.11
Nodes (6): todayIso(), ZERO, amountOrEmpty(), FIXED, OnboardingPage, ProgressService

### Community 71 - "home.ts"
Cohesion: 0.20
Nodes (5): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService

### Community 74 - "household.service.ts"
Cohesion: 0.36
Nodes (3): aeadDecrypt(), decryptPayload(), payloadAad()

### Community 76 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "recover.ts"
Cohesion: 0.12
Nodes (12): WrongRecoveryPhraseError, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), Recover, CURRENCIES (+4 more)

### Community 79 - "key-update.ts"
Cohesion: 0.24
Nodes (9): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8() (+1 more)

### Community 80 - "PrismaService"
Cohesion: 0.06
Nodes (11): HouseholdAccessService, createReminder, markRead, NotificationsController, subscription, unsubscribe, uuid, RemindersProcessor (+3 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "openapi.ts"
Cohesion: 0.25
Nodes (6): @nestjs/core@^12.0.1, @nestjs/swagger@^12.1.2, document, out, @nestjs/core, @nestjs/swagger

### Community 83 - "card-statement.ts"
Cohesion: 0.18
Nodes (17): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+9 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - "getSodium"
Cohesion: 0.19
Nodes (20): RegistrationForm, RegistrationService, aeadEncrypt(), encryptPayload(), FAST_KDF, generateIdentity(), sealPrivateKeys(), deriveKeyFromPassphrase() (+12 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "@nestjs/authentication"
Cohesion: 0.13
Nodes (9): AuthModule, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, UsersModule, authUserSelect, UsersRepository (+1 more)

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
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `zod` to `@nestjs/authentication`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `debts.controller.ts`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `test/helpers.ts`, `PrismaService`, `currencies.controller.ts`, `toBase64`, `goals.ts`, `deposits.ts`, `zod`, `TransactionsController`, `toBase64`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.056910569105691054 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@jsverse/transloco` to `savings.service.ts`, `onboarding-page.ts`, `AccountsService`, `household.service.ts`, `debts-page.ts`, `dependencies`, `key-vault.service.ts`, `recover.ts`, `debts-page.ts`, `getSodium`, `frontend/package.json`, `parseDecimalInput`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/authentication` connect `@nestjs/authentication` to `zod`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `debts.controller.ts`, `health.controller.ts`, `src/recurring/recurring.service.ts`, `test/helpers.ts`, `PrismaService`, `toBase64`, `goals.ts`, `deposits.ts`, `zod`, `TransactionsController`, `toBase64`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._