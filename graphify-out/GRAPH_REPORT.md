# Graph Report - commit  (2026-11-26)

## Corpus Check
- 286 files · ~128,716 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 44 file(s) not represented in the graph (top: .scss 23, (none) 14, .example 2)

## Summary
- 2337 nodes · 5978 edges · 130 communities (74 shown, 56 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4b3f82f2`
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
- default-categories.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- currencies.controller.ts
- deposits.ts
- backend-dev
- frontend
- environment
- services
- frontend-dev
- TransactionsPage
- volumes
- deposits.ts
- rate-sources.ts
- rates.module.ts
- savings-page.ts
- parseDecimalInput
- @nestjs/common
- ProgressController
- HouseholdRatesController
- SettingsPage
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- features/recurring/recurring.service.ts
- InvestmentsService
- @jsverse/transloco
- progress.service.ts
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
- parseDecimalInput
- @angular/forms
- articles.ts
- recurring-page.ts
- DebtsService
- e2e/helpers.ts
- backend/README.md
- Converter
- NotificationsController
- debts.controller.ts
- MeResponse
- MembersService
- session-keys.ts
- DepositsService
- OnboardingPage
- .require
- EsArDateAdapter
- HouseholdService
- NotificationsService
- HouseholdPage
- crypto.spec.ts
- getSodium
- AuthService
- ngsw-config.json
- card-cycle.ts
- card-statement.ts
- InstallmentsService
- Recover
- RatesService
- getSodium
- TradeDialog
- version.ts
- AutoLockService
- reminder-plan.ts
- adminer
- AccountsPage
- Frontend
- @nestjs/authentication
- openapi.ts
- ArticlePage
- RatesService
- payloadAad
- .oxlintrc.json
- RedisModule
- PlanService
- allowBuilds
- dotenv
- nest-cli.json
- landing.ts
- ChangePassphrase
- allowBuilds
- Unlock
- FakePush
- libsodium-wrappers-sumo
- material-symbols@0.49.0

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 71 edges
2. `@angular/core` - 71 edges
3. `PrismaService` - 66 edges
4. `parseDecimalInput()` - 53 edges
5. `KeyVaultService` - 43 edges
6. `@angular/material` - 42 edges
7. `@jsverse/transloco` - 42 edges
8. `@angular/common` - 41 edges
9. `AccountsService` - 36 edges
10. `toBase64()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `optional()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/savings/dialogs/trade-dialog.ts → frontend/src/app/core/money/decimal.ts
- `newRule()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/recurring.e2e.ts → frontend/e2e/helpers.ts
- `newTransaction()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/transactions.e2e.ts → frontend/e2e/helpers.ts
- `UpdateKeysRequest` --references--> `DEFAULT_KDF_PARAMS`  [EXTRACTED]
  frontend/src/app/core/crypto/key-vault.service.ts → frontend/src/app/core/crypto/kdf.ts

## Import Cycles
- None detected.

## Communities (130 total, 56 thin omitted)

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
Nodes (25): dependencies, bullmq@^6.7.10, cookie-parser@^1.4.7, @nestjs/authentication@^0.1.7, @nestjs/bullmq@^12.0.2, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1 (+17 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (44): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+36 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.22
Nodes (4): familyRevokedKey(), RedisRefreshTokenStore, tokenKey(), userFamiliesKey()

### Community 7 - "progress-engine.ts"
Cohesion: 0.05
Nodes (40): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+32 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.14
Nodes (4): AccountsController, CreateAccountInput, AccountsService, toDto()

### Community 9 - "AccountsService"
Cohesion: 0.09
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.16
Nodes (24): memberKeySignedMessage(), newUser(), payload(), payload(), setup(), payload(), setup(), b64() (+16 more)

### Community 12 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+12 more)

### Community 13 - "debts-page.ts"
Cohesion: 0.07
Nodes (27): subDecimals(), DebtDialog, fractionToPercent(), percentToFraction(), shiftPoint(), Amortization, amortizationSchedule(), frenchPayment() (+19 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.11
Nodes (16): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+8 more)

### Community 17 - "RecurringService"
Cohesion: 0.07
Nodes (22): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+14 more)

### Community 19 - "deposits.ts"
Cohesion: 0.13
Nodes (14): averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween(), DepositProjection, depositProjection(), GoalProgress, goalProgress() (+6 more)

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
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 27 - "deposits.ts"
Cohesion: 0.05
Nodes (45): StoredRecord, toBase64(), encryptedPayload, keyVersion, linkedTransaction, LinkedTransaction, toIsoDate(), paymentDto() (+37 more)

### Community 28 - "rate-sources.ts"
Cohesion: 0.15
Nodes (10): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+2 more)

### Community 29 - "rates.module.ts"
Cohesion: 0.13
Nodes (8): RatesModule, RATES_QUEUE, RatesProcessor, RatesScheduler, RatesService, ratesToday(), bullmq, @nestjs/bullmq

### Community 30 - "savings-page.ts"
Cohesion: 0.08
Nodes (34): CurrenciesService, Currency, DATE_PROVIDERS, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), formatMoney() (+26 more)

### Community 31 - "parseDecimalInput"
Cohesion: 0.07
Nodes (25): compareDecimals(), normalize(), parseDecimalInput(), stripThousands(), decimal(), accountIcon(), optionalAmount(), amount() (+17 more)

### Community 32 - "@nestjs/common"
Cohesion: 0.06
Nodes (25): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, Env, envSchema, DebtsModule (+17 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.13
Nodes (4): BudgetsController, CreateBudgetInput, BudgetsService, toDto()

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.14
Nodes (5): RecurringController, CreateRuleInput, PostOccurrencesInput, RecurringService, toDto()

### Community 42 - "installments/installments.service.ts"
Cohesion: 0.14
Nodes (6): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, InstallmentsService, toDto()

### Community 43 - "features/recurring/recurring.service.ts"
Cohesion: 0.10
Nodes (34): Method, RequestBody, CreateAccount, CreateTransactions, HouseholdPayload, MeHousehold, KeyVaultService, UpdateKeysRequest (+26 more)

### Community 45 - "@jsverse/transloco"
Cohesion: 0.07
Nodes (22): App, appConfig, NAV, NavItem, routes, RegisterRequest, TokenResponse, authInterceptor() (+14 more)

### Community 46 - "progress.service.ts"
Cohesion: 0.10
Nodes (32): addDecimals(), fromUnits(), negateDecimal(), percentOf(), ratioOf(), BTC, PAB, USD (+24 more)

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

### Community 51 - "frontend/package.json"
Cohesion: 0.11
Nodes (23): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, openapi-typescript@^7.13.0, @playwright/test@^1.65.1, prettier@^3.8.1 (+15 more)

### Community 52 - "PrismaService"
Cohesion: 0.09
Nodes (13): CategoriesController, HouseholdAccess, HouseholdAccessService, accept, defaultHousehold, grant, invite, role (+5 more)

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
Cohesion: 0.04
Nodes (67): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+59 more)

### Community 59 - "@angular/forms"
Cohesion: 0.17
Nodes (7): WrongPassphraseError, WrongRecoveryPhraseError, SessionService, CURRENCIES, differentFrom(), matchValidator(), @angular/forms

### Community 60 - "articles.ts"
Cohesion: 0.26
Nodes (8): buildPlan(), effectiveRate(), pick(), PlanDebt, PlanInput, PlanResult, round2(), lastFullMonths()

### Community 62 - "DebtsService"
Cohesion: 0.26
Nodes (4): DebtDraft, DebtDto, PaymentDraft, DebtsService

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.11
Nodes (16): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+8 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - "debts.controller.ts"
Cohesion: 0.14
Nodes (3): DebtsController, CreateDebtInput, DebtsService

### Community 68 - "MeResponse"
Cohesion: 0.42
Nodes (3): MeResponse, Identity, fromBase64()

### Community 69 - "MembersService"
Cohesion: 0.07
Nodes (17): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+9 more)

### Community 70 - "session-keys.ts"
Cohesion: 0.30
Nodes (12): b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity(), restoreIdentity() (+4 more)

### Community 78 - "crypto.spec.ts"
Cohesion: 0.18
Nodes (10): @scure/bip39@^2.4.0, FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord() (+2 more)

### Community 79 - "getSodium"
Cohesion: 0.17
Nodes (14): DEFAULT_KDF_PARAMS, deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, concat(), KeyUpdateFields (+6 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "card-cycle.ts"
Cohesion: 0.47
Nodes (9): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), statementMonthOf() (+1 more)

### Community 83 - "card-statement.ts"
Cohesion: 0.21
Nodes (9): Cycle, shiftMonth(), estimateStatement(), card, plan, StatementEstimate, upcomingInstallments(), InstallmentPlan (+1 more)

### Community 88 - "getSodium"
Cohesion: 0.18
Nodes (19): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), generateIdentity(), openPrivateKeys() (+11 more)

### Community 89 - "TradeDialog"
Cohesion: 0.33
Nodes (4): TradeDialog, AssetClass, TradeType, InvestmentsDto

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
Cohesion: 0.06
Nodes (18): RegisterInput, AuthService, JwtAuth, verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR (+10 more)

### Community 97 - "openapi.ts"
Cohesion: 0.33
Nodes (4): @nestjs/swagger@^12.1.2, document, out, @nestjs/swagger

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
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/authentication`, `dependencies`, `devDependencies`, `MembersService`, `health.controller.ts`, `installments/installments.service.ts`, `test/helpers.ts`, `currencies.controller.ts`, `PrismaService`, `goals.ts`, `deposits.ts`, `rate-sources.ts`, `rates.module.ts`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `features/recurring/recurring.service.ts` to `progress-engine.ts`, `dependencies`, `@jsverse/transloco`, `debts-page.ts`, `frontend/package.json`, `getSodium`, `@angular/forms`, `articles.ts`, `savings-page.ts`, `parseDecimalInput`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06161616161616162 - nodes in this community are weakly interconnected._