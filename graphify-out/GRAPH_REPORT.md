# Graph Report - commit  (2026-11-26)

## Corpus Check
- 184 files · ~59,773 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 34 file(s) not represented in the graph (top: (none) 14, .scss 14, .example 2)

## Summary
- 1472 nodes · 3622 edges · 72 communities (64 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `471253e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- scripts
- frontend
- dependencies
- backend/package.json
- auth.controller.ts
- redis-refresh-token.store.ts
- src/auth/auth.service.ts
- src/accounts/accounts.service.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- features/debts/debts.service.ts
- getSodium
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @nestjs/common
- cards/installments.service.ts
- backend-dev
- frontend
- environment
- services
- frontend-dev
- TransactionsPage
- volumes
- currencies.controller.ts
- e2e/helpers.ts
- TransactionsController
- key-vault.service.ts
- debt-dialog.ts
- installments.controller.ts
- .require
- budgets/budgets.service.ts
- @jsverse/transloco
- BudgetDialog
- auth.module.ts
- health.controller.ts
- AuthService
- transactions.controller.ts
- src/transactions/transactions.service.ts
- RecurringService
- TransactionsService
- KeyVaultService
- schedule-dialog.ts
- @angular/core
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- .updateKeys
- CategoriesService
- decimal.ts
- redis
- BudgetPage
- healthcheck
- key-update.ts
- Login
- recover.ts
- Home
- backend/README.md
- migrate
- adminer
- Frontend
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- @nestjs/authentication
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 52 edges
2. `@angular/core` - 44 edges
3. `PrismaService` - 41 edges
4. `getSodium()` - 34 edges
5. `parseDecimalInput()` - 29 edges
6. `@angular/common` - 28 edges
7. `KeyVaultService` - 27 edges
8. `RecurringService` - 26 edges
9. `TransactionsService` - 26 edges
10. `@angular/material` - 26 edges

## Surprising Connections (you probably didn't know these)
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `newDebt()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/debts.e2e.ts → frontend/e2e/helpers.ts
- `expense()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/budget.e2e.ts → frontend/e2e/helpers.ts
- `newRule()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/recurring.e2e.ts → frontend/e2e/helpers.ts
- `newTransaction()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/transactions.e2e.ts → frontend/e2e/helpers.ts

## Import Cycles
- None detected.

## Communities (72 total, 8 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.12
Nodes (21): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+13 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (42): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+34 more)

### Community 3 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1, @nestjs/swagger@^12.1.2, pg@^8.23.1, @prisma/adapter-pg@7.10.1 (+11 more)

### Community 4 - "backend/package.json"
Cohesion: 0.06
Nodes (43): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+35 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.14
Nodes (11): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, Credentials, credentialsSchema, RegisterInput, registerSchema, clearRefreshCookie() (+3 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.18
Nodes (6): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS

### Community 7 - "src/auth/auth.service.ts"
Cohesion: 0.10
Nodes (13): AuthService, JwtAuth, memberKeySignedMessage(), verifyEd25519(), UpdateKeysInput, KeysService, AuthUser, @nestjs/authentication (+5 more)

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.08
Nodes (17): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+9 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.09
Nodes (14): AccountDialog, CARD_NETWORKS, decimal(), Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon() (+6 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.17
Nodes (20): KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, newUser(), payload(), payload(), setup() (+12 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+17 more)

### Community 13 - "features/debts/debts.service.ts"
Cohesion: 0.09
Nodes (14): DebtDialog, Amortization, Debt, DebtDraft, DebtDto, DebtKind, DebtPayload, DebtPayment (+6 more)

### Community 14 - "getSodium"
Cohesion: 0.16
Nodes (22): RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, generateIdentity() (+14 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.12
Nodes (14): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+6 more)

### Community 17 - "RecurringService"
Cohesion: 0.08
Nodes (21): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+13 more)

### Community 18 - "@nestjs/common"
Cohesion: 0.11
Nodes (12): AccountsModule, AppModule, AuthModule, BudgetsModule, CategoriesModule, DebtsModule, HouseholdsModule, InstallmentsModule (+4 more)

### Community 19 - "cards/installments.service.ts"
Cohesion: 0.20
Nodes (11): closingDate(), cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift(), shiftMonth() (+3 more)

### Community 20 - "backend-dev"
Cohesion: 0.15
Nodes (13): depends_on, depends_on, ports, profiles, volumes, profiles, restart, migrate (+5 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.44
Nodes (9): environment, environment, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT, REDIS_URL (+1 more)

### Community 23 - "services"
Cohesion: 0.25
Nodes (7): name, services, x-backend-env, DATABASE_URL, JWT_SECRET, PORT, REDIS_URL

### Community 24 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 27 - "currencies.controller.ts"
Cohesion: 0.16
Nodes (3): CurrenciesController, CurrenciesModule, PrismaService

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.19
Nodes (12): expense(), newDebt(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip() (+4 more)

### Community 29 - "TransactionsController"
Cohesion: 0.08
Nodes (20): syncPage(), SyncQuery, syncQuerySchema, TransactionsController, uuid, CreateTransactionsInput, createTransactionsSchema, fields (+12 more)

### Community 30 - "key-vault.service.ts"
Cohesion: 0.14
Nodes (7): wipeIdentity(), DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError, SessionService, ChangePassphrase, Unlock

### Community 31 - "debt-dialog.ts"
Cohesion: 0.12
Nodes (20): EsArDateAdapter, fromIsoDate(), toIsoDate(), normalize(), parseDecimalInput(), stripThousands(), toInputValue(), optionalAmount() (+12 more)

### Community 32 - "installments.controller.ts"
Cohesion: 0.15
Nodes (5): InstallmentsController, uuid, CreatePlanInput, createPlanSchema, InstallmentsService

### Community 33 - ".require"
Cohesion: 0.12
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 34 - "budgets/budgets.service.ts"
Cohesion: 0.14
Nodes (11): uuid, budgetFields, CreateBudgetInput, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema (+3 more)

### Community 35 - "@jsverse/transloco"
Cohesion: 0.12
Nodes (14): App, appConfig, routes, authInterceptor(), authGuard(), guestGuard(), unlockedGuard(), DATE_PROVIDERS (+6 more)

### Community 37 - "auth.module.ts"
Cohesion: 0.13
Nodes (8): cookie-parser@^1.4.7, Env, envSchema, app, config, RedisModule, cookie-parser, @nestjs/core

### Community 38 - "health.controller.ts"
Cohesion: 0.13
Nodes (7): @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 39 - "AuthService"
Cohesion: 0.16
Nodes (8): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, RegistrationForm, DEFAULT_CATEGORIES, DefaultCategory

### Community 40 - "transactions.controller.ts"
Cohesion: 0.14
Nodes (16): categorySchema, encryptedPayload, kdfParamsSchema, userKeysSchema, base64Bytes(), isoDate, encryptedPayload, uuid (+8 more)

### Community 41 - "src/transactions/transactions.service.ts"
Cohesion: 0.11
Nodes (10): CategoriesController, toBase64(), toIsoDate(), paymentDto(), toDto(), HouseholdAccess, HouseholdAccessService, toDto() (+2 more)

### Community 42 - "RecurringService"
Cohesion: 0.13
Nodes (6): deleteQuerySchema, BudgetsController, RecurringController, CreateRuleInput, UpdateRuleInput, RecurringService

### Community 43 - "TransactionsService"
Cohesion: 0.19
Nodes (5): TransactionDto, TransactionType, Page, SingleDraft, TransactionsService

### Community 44 - "KeyVaultService"
Cohesion: 0.35
Nodes (4): MeResponse, Identity, KeyVaultService, fromBase64()

### Community 45 - "schedule-dialog.ts"
Cohesion: 0.24
Nodes (3): toMoney(), PaymentDialog, ScheduleDialog

### Community 46 - "@angular/core"
Cohesion: 0.22
Nodes (18): CurrenciesService, Currency, monthOf(), todayIso(), HouseholdContextService, formatMoney(), BudgetDialogData, Installment (+10 more)

### Community 47 - "BudgetsService"
Cohesion: 0.20
Nodes (7): Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, format, lint, start, start:debug, start:dev (+6 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 53 - "decimal.ts"
Cohesion: 0.07
Nodes (54): addDecimals(), compareDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), ARS (+46 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "key-update.ts"
Cohesion: 0.33
Nodes (8): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8()

### Community 60 - "recover.ts"
Cohesion: 0.12
Nodes (12): WrongRecoveryPhraseError, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord(), Recover, CURRENCIES (+4 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 87 - "migrate"
Cohesion: 0.48
Nodes (7): build, build, context, target, build, build, build

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.25
Nodes (7): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 109 - "@nestjs/authentication"
Cohesion: 0.18
Nodes (9): ioredis@^6.1.0, @nestjs/authentication@^0.1.7, dotenv@^18.0.10, prisma@7.10.1, redis, dotenv, ioredis, @nestjs/authentication (+1 more)

### Community 112 - "allowBuilds"
Cohesion: 0.40
Nodes (4): allowBuilds, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `installments.controller.ts`, `.require`, `budgets/budgets.service.ts`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `src/auth/auth.service.ts`, `src/accounts/accounts.service.ts`, `transactions.controller.ts`, `src/transactions/transactions.service.ts`, `health.controller.ts`, `auth.module.ts`, `test/helpers.ts`, `currencies.controller.ts`, `TransactionsController`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `frontend/package.json`, `@jsverse/transloco`, `AuthService`, `features/accounts/accounts.service.ts`, `dependencies`, `schedule-dialog.ts`, `recover.ts`, `key-vault.service.ts`, `debt-dialog.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/authentication` connect `@nestjs/authentication` to `installments.controller.ts`, `.require`, `budgets/budgets.service.ts`, `backend/package.json`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `src/auth/auth.service.ts`, `src/accounts/accounts.service.ts`, `transactions.controller.ts`, `health.controller.ts`, `test/helpers.ts`, `TransactionsController`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._