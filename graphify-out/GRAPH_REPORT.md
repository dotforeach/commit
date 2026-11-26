# Graph Report - commit  (2026-11-26)

## Corpus Check
- 267 files · ~115,604 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 42 file(s) not represented in the graph (top: .scss 21, (none) 14, .example 2)

## Summary
- 2253 nodes · 5796 edges · 112 communities (79 shown, 33 thin omitted)
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
- debt-dialog.ts
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
- @nestjs/common
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
- savings-page.ts
- debts-page.ts
- zod
- ProgressController
- progress-engine.ts
- SettingsPage
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- src/recurring/recurring.service.ts
- NotificationsService
- debts-page.ts
- InvestmentsService
- @jsverse/transloco
- base64.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- NotificationsController
- toBase64
- TransactionsService
- redis
- BudgetPage
- healthcheck
- goals.ts
- parseDecimalInput
- .require
- plan-engine.ts
- recurring-page.ts
- frontend/package.json
- src/recurring/recurring.service.ts
- backend/README.md
- Converter
- HouseholdRatesController
- debts.controller.ts
- KeyVaultService
- MembersService
- onboarding-page.ts
- home.ts
- RatesService
- GoalsService
- ProgressService
- HouseholdService
- openapi.ts
- HouseholdPage
- recover.ts
- key-update.ts
- PrismaService
- ngsw-config.json
- Unlock
- card-cycle.ts
- DepositsService
- savings-math.ts
- migrate
- .register
- change-passphrase.ts
- frontend/package.json
- RecurringPage
- version.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- RatesPage
- currencies.controller.ts
- reminder-plan.ts
- libsodium-wrappers-sumo
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- rxjs@~7.8.0
- nest-cli.json
- RemindersScheduler
- @angular/compiler@^22.3.0
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
9. `getSodium()` - 36 edges
10. `toBase64()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `Debt` --references--> `Amortization`  [EXTRACTED]
  frontend/src/app/features/debts/debt.model.ts → frontend/src/app/features/debts/debt-math.ts
- `effectiveRate()` --calls--> `monthlyRate()`  [EXTRACTED]
  frontend/src/app/features/plan/plan-engine.ts → frontend/src/app/features/debts/debt-math.ts
- `buildPlan()` --calls--> `simulatePayoff()`  [EXTRACTED]
  frontend/src/app/features/plan/plan-engine.ts → frontend/src/app/features/debts/debt-math.ts

## Import Cycles
- None detected.

## Communities (112 total, 33 thin omitted)

### Community 0 - "savings.service.ts"
Cohesion: 0.05
Nodes (22): TradeDialog, Asset, AssetClass, Contribution, Deposit, DepositPayload, Goal, GoalDraft (+14 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, api:types, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/platform-express@^12.0.1 (+15 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (43): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, oxlint@^1.58.0, oxlint-tsgolint@^7.0.2001 (+35 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "debt-dialog.ts"
Cohesion: 0.16
Nodes (14): DebtDialog, fractionToPercent(), percentToFraction(), shiftPoint(), Amortization, DebtDto, DebtKind, DebtPayload (+6 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (3): AccountsController, AccountsService, toDto()

### Community 9 - "AccountsService"
Cohesion: 0.14
Nodes (12): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload (+4 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.06
Nodes (41): memberKeySignedMessage(), coinGecko, COINS, DOLAR_CASAS, dolarApiItem, mid(), PublicRate, RateSources (+33 more)

### Community 12 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @angular/common@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0, @angular/router@^22.3.0, @angular/service-worker@^22.3.0 (+8 more)

### Community 13 - "debt-dialog.ts"
Cohesion: 0.12
Nodes (4): Debt, DebtDraft, DebtsPage, DebtsService

### Community 14 - "key-vault.service.ts"
Cohesion: 0.20
Nodes (10): HouseholdPayload, MeHousehold, RegisterRequest, RegistrationForm, keyFingerprint(), generateIdentity(), DEFAULT_KDF_PARAMS, UpdateKeysRequest (+2 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (15): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+7 more)

### Community 17 - "RecurringService"
Cohesion: 0.11
Nodes (16): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+8 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.08
Nodes (22): AccountsModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule, HouseholdsModule, InstallmentsModule (+14 more)

### Community 19 - "ledger.ts"
Cohesion: 0.14
Nodes (15): card, plan, InstallmentPlan, AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf() (+7 more)

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
Nodes (26): encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, collectDeposit, createDeposit, datesMsg, DepositsModule (+18 more)

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.13
Nodes (16): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+8 more)

### Community 29 - "TransactionsController"
Cohesion: 0.13
Nodes (19): SAFE_LAG_MS, syncPage(), SyncQuery, syncQuerySchema, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+11 more)

### Community 30 - "savings-page.ts"
Cohesion: 0.14
Nodes (21): CurrenciesService, Currency, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), toInputValue(), accountIcon() (+13 more)

### Community 31 - "debts-page.ts"
Cohesion: 0.08
Nodes (46): addDecimals(), formatMoney(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), ARS (+38 more)

### Community 32 - "zod"
Cohesion: 0.13
Nodes (7): isoDate, InstallmentsController, uuid, CreatePlanInput, createPlanSchema, encryptedPayload, InstallmentsService

### Community 34 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.14
Nodes (3): BudgetsController, BudgetsService, toDto()

### Community 42 - "NotificationsService"
Cohesion: 0.09
Nodes (4): Login, Home, JoinPage, NotificationsService

### Community 43 - "debts-page.ts"
Cohesion: 0.12
Nodes (22): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdContextService, isNetworkError(), OfflineCacheService, SessionService (+14 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.07
Nodes (22): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), remember(), takeReturnUrl() (+14 more)

### Community 46 - "base64.ts"
Cohesion: 0.09
Nodes (16): @nestjs/throttler@^6.8.0, verifyEd25519(), base64Bytes(), accept, defaultHousehold, grant, invite, role (+8 more)

### Community 47 - "BudgetsService"
Cohesion: 0.10
Nodes (10): BudgetDialog, cat(), ctx(), Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto (+2 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "NotificationsController"
Cohesion: 0.12
Nodes (4): NotificationsController, RemindersProcessor, PushService, RemindersService

### Community 52 - "toBase64"
Cohesion: 0.11
Nodes (18): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), toDto(), assetClass, assetDto() (+10 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "goals.ts"
Cohesion: 0.06
Nodes (31): uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema, day (+23 more)

### Community 58 - "parseDecimalInput"
Cohesion: 0.14
Nodes (17): compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), optionalAmount(), amount(), PaymentDialog, positive() (+9 more)

### Community 60 - "plan-engine.ts"
Cohesion: 0.15
Nodes (9): buildPlan(), effectiveRate(), pick(), PlanDebt, PlanInput, PlanResult, PlanStep, round2() (+1 more)

### Community 61 - "recurring-page.ts"
Cohesion: 0.18
Nodes (6): Frequency, CategoriesService, RecurringRule, RuleDto, RulePayload, RuleDialog

### Community 62 - "frontend/package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @angular/build@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+8 more)

### Community 63 - "src/recurring/recurring.service.ts"
Cohesion: 0.23
Nodes (10): uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema, ruleFields (+2 more)

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
Cohesion: 0.16
Nodes (6): MeResponse, Identity, KeyVaultService, WrongPassphraseError, WrongRecoveryPhraseError, recoveryKeyFromPhrase()

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (3): hashToken(), MembersController, MembersService

### Community 76 - "openapi.ts"
Cohesion: 0.15
Nodes (9): @nestjs/core@^12.0.1, @nestjs/swagger@^12.1.2, @nestjs/testing@^12.0.1, AppModule, document, out, @nestjs/core, @nestjs/swagger (+1 more)

### Community 77 - "HouseholdPage"
Cohesion: 0.26
Nodes (3): HouseholdPage, Invitation, Member

### Community 78 - "recover.ts"
Cohesion: 0.13
Nodes (11): byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), Recover, CURRENCIES, Register (+3 more)

### Community 79 - "key-update.ts"
Cohesion: 0.20
Nodes (15): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat(), KeyUpdateFields (+7 more)

### Community 80 - "PrismaService"
Cohesion: 0.13
Nodes (4): CategoriesController, HouseholdAccess, HouseholdAccessService, PrismaService

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 83 - "card-cycle.ts"
Cohesion: 0.18
Nodes (12): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+4 more)

### Community 86 - "savings-math.ts"
Cohesion: 0.17
Nodes (16): AmountDialog, AmountDialogData, AmountDialogResult, toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween() (+8 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 88 - ".register"
Cohesion: 0.17
Nodes (16): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, openPrivateKeys() (+8 more)

### Community 90 - "frontend/package.json"
Cohesion: 0.17
Nodes (11): @angular/cdk@22.3.0, @fontsource/roboto@5.3.0, @angular/cli@^22.3.0, license, name, packageManager, private, version (+3 more)

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "@nestjs/authentication"
Cohesion: 0.12
Nodes (10): AuthModule, AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, UsersModule, authUserSelect (+2 more)

### Community 99 - "reminder-plan.ts"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

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
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `zod`, `currencies.controller.ts`, `dependencies`, `devDependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `debts.controller.ts`, `health.controller.ts`, `test/helpers.ts`, `openapi.ts`, `base64.ts`, `PrismaService`, `toBase64`, `goals.ts`, `deposits.ts`, `TransactionsController`, `src/recurring/recurring.service.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `savings.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05289450484866295 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `savings-page.ts` to `savings.service.ts`, `parseDecimalInput`, `debt-dialog.ts`, `AccountsService`, `debts-page.ts`, `dependencies`, `@jsverse/transloco`, `key-vault.service.ts`, `recover.ts`, `savings-math.ts`, `frontend/package.json`, `recurring-page.ts`, `debts-page.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`, `frontend/package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._