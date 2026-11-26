# Graph Report - commit  (2026-11-26)

## Corpus Check
- 159 files · ~48,442 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 33 file(s) not represented in the graph (top: (none) 14, .scss 13, .example 2)

## Summary
- 1269 nodes · 2952 edges · 79 communities (61 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1817e973`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- scripts
- frontend
- dependencies
- devDependencies
- auth.controller.ts
- redis-refresh-token.store.ts
- UsersRepository
- src/accounts/accounts.service.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- app.config.ts
- registration.service.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- @nestjs/common
- me.controller.ts
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
- transactions-page.ts
- accounts.schemas.ts
- .require
- RuleDialog
- @angular/router
- budget-dialog.ts
- app.module.ts
- health.controller.ts
- AuthService
- transactions.controller.ts
- budgets/budgets.service.ts
- recurring.controller.ts
- TransactionsService
- Recover
- backend/package.json
- features/recurring/recurring.service.ts
- BudgetsService
- nest-cli.dev.json
- scripts
- migrate
- KeyVaultService
- TransactionDialog
- decimal.ts
- redis
- BudgetPage
- healthcheck
- key-update.ts
- budget-math.spec.ts
- RedisModule
- Register
- Home
- wipeIdentity
- default-categories.ts
- backend/README.md
- @nestjs/mau@^0.2.6
- oxlint@^1.58.0
- source-map-support@^0.5.21
- vitest@^4.1.2
- migrate
- adminer
- Frontend
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 45 edges
2. `@angular/core` - 38 edges
3. `PrismaService` - 36 edges
4. `getSodium()` - 34 edges
5. `RecurringService` - 26 edges
6. `KeyVaultService` - 25 edges
7. `@angular/common` - 24 edges
8. `TransactionsService` - 23 edges
9. `AccountsService` - 23 edges
10. `@jsverse/transloco` - 22 edges

## Surprising Connections (you probably didn't know these)
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts
- `payload()` --calls--> `b64()`  [EXTRACTED]
  backend/test/budgets.e2e-spec.ts → backend/test/helpers.ts
- `setup()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/budgets.e2e-spec.ts → backend/test/helpers.ts
- `expense()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/budget.e2e.ts → frontend/e2e/helpers.ts
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts

## Import Cycles
- None detected.

## Communities (79 total, 18 thin omitted)

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
Cohesion: 0.08
Nodes (25): dependencies, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1 (+17 more)

### Community 4 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, @nestjs/cli@^12.0.0, @nestjs/schematics@^12.0.0, oxlint-tsgolint@^7.0.2001, prettier@^3.4.2, supertest@^7.0.0, @types/express@^5.0.0, @types/pg@^8.23.1 (+12 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "UsersRepository"
Cohesion: 0.12
Nodes (9): RegisterInput, AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect, UsersRepository (+1 more)

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.13
Nodes (4): AccountsController, CreateAccountInput, listQuerySchema, AccountsService

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.11
Nodes (13): AccountDialog, CARD_NETWORKS, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon(), AccountPayload (+5 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.17
Nodes (19): memberKeySignedMessage(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, newUser(), payload(), payload() (+11 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+17 more)

### Community 13 - "app.config.ts"
Cohesion: 0.19
Nodes (5): App, appConfig, routes, authInterceptor(), TranslocoHttpLoader

### Community 14 - "registration.service.ts"
Cohesion: 0.17
Nodes (23): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF (+15 more)

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
Cohesion: 0.09
Nodes (9): AccountsModule, CategoriesController, CategoriesModule, HouseholdAccess, HouseholdAccessService, HouseholdsModule, PrismaService, RecurringModule (+1 more)

### Community 19 - "me.controller.ts"
Cohesion: 0.13
Nodes (7): verifyEd25519(), base64Bytes(), UpdateKeysInput, updateKeysSchema, KeysService, MeController, UsersModule

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
Cohesion: 0.15
Nodes (4): formatMoney(), LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.21
Nodes (11): expense(), createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip(), unlock() (+3 more)

### Community 29 - "TransactionsController"
Cohesion: 0.14
Nodes (3): TransactionsController, toDto(), TransactionsService

### Community 30 - "key-vault.service.ts"
Cohesion: 0.16
Nodes (6): DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError, WrongRecoveryPhraseError, SessionService, Unlock

### Community 31 - "transactions-page.ts"
Cohesion: 0.13
Nodes (20): CurrenciesService, Currency, DATE_PROVIDERS, EsArDateAdapter, fromIsoDate(), monthOf(), todayIso(), toIsoDate() (+12 more)

### Community 32 - "accounts.schemas.ts"
Cohesion: 0.13
Nodes (15): uuid, accountFields, accountTypeSchema, createAccountSchema, creditCardMessage, creditCardSchema, day, deleteQuerySchema (+7 more)

### Community 33 - ".require"
Cohesion: 0.09
Nodes (8): BudgetsController, CreateBudgetInput, BudgetsService, toDto(), RecurringController, CreateRuleInput, RecurringService, toDto()

### Community 35 - "@angular/router"
Cohesion: 0.15
Nodes (15): authGuard(), guestGuard(), unlockedGuard(), byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord() (+7 more)

### Community 36 - "budget-dialog.ts"
Cohesion: 0.12
Nodes (14): normalize(), parseDecimalInput(), stripThousands(), toInputValue(), decimal(), BudgetDialog, BudgetDialogData, optionalAmount() (+6 more)

### Community 37 - "app.module.ts"
Cohesion: 0.13
Nodes (13): AppModule, AuthModule, Env, envSchema, HealthModule, app, config, PrismaModule (+5 more)

### Community 39 - "AuthService"
Cohesion: 0.21
Nodes (5): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService

### Community 40 - "transactions.controller.ts"
Cohesion: 0.16
Nodes (17): syncPage(), SyncQuery, syncQuerySchema, toIsoDate(), uuid, CreateTransactionsInput, createTransactionsSchema, fields (+9 more)

### Community 41 - "budgets/budgets.service.ts"
Cohesion: 0.16
Nodes (9): uuid, BudgetsModule, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema (+1 more)

### Community 42 - "recurring.controller.ts"
Cohesion: 0.21
Nodes (10): isoDate, uuid, coherentMessage, createRuleSchema, encryptedPayload, PostOccurrencesInput, postOccurrencesSchema, ruleFields (+2 more)

### Community 45 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, description, @nestjs/testing@^12.0.1, @types/cookie-parser@^1.4.10, @types/node@^24.0.0, vite@^8.0.0, license, name (+7 more)

### Community 46 - "features/recurring/recurring.service.ts"
Cohesion: 0.28
Nodes (9): HouseholdContextService, Transaction, TransactionDto, TransactionPayload, TransactionType, Page, SingleDraft, TransferDraft (+1 more)

### Community 47 - "BudgetsService"
Cohesion: 0.30
Nodes (3): Budget, BudgetDraft, BudgetsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, format, lint, start, start:debug, start:dev (+6 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "KeyVaultService"
Cohesion: 0.37
Nodes (4): MeResponse, Identity, KeyVaultService, fromBase64()

### Community 53 - "decimal.ts"
Cohesion: 0.12
Nodes (32): addDecimals(), compareDecimals(), fromUnits(), isNegative(), negateDecimal(), percentOf(), ratioOf(), ARS (+24 more)

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

### Community 57 - "key-update.ts"
Cohesion: 0.33
Nodes (8): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8()

### Community 58 - "budget-math.spec.ts"
Cohesion: 0.32
Nodes (4): BudgetContext, cat(), ctx(), Category

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

### Community 109 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^18.0.10, prisma@7.10.1, dotenv, prisma

### Community 112 - "allowBuilds"
Cohesion: 0.40
Nodes (4): allowBuilds, prisma, @prisma/engines, @scarf/scarf

## Knowledge Gaps
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `app.module.ts` to `accounts.schemas.ts`, `dependencies`, `auth.controller.ts`, `redis-refresh-token.store.ts`, `UsersRepository`, `transactions.controller.ts`, `budgets/budgets.service.ts`, `recurring.controller.ts`, `test/helpers.ts`, `backend/package.json`, `@nestjs/common`, `me.controller.ts`, `currencies.controller.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `transactions-page.ts` to `frontend/package.json`, `@angular/router`, `budget-dialog.ts`, `AuthService`, `features/accounts/accounts.service.ts`, `dependencies`, `app.config.ts`, `registration.service.ts`, `features/recurring/recurring.service.ts`, `key-vault.service.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._