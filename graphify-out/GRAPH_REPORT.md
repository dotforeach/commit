# Graph Report - commit  (2026-11-26)

## Corpus Check
- 146 files · ~41,931 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 31 file(s) not represented in the graph (top: (none) 14, .scss 11, .example 2)

## Summary
- 1155 nodes · 2595 edges · 74 communities (57 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04e241f9`
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
- UsersRepository
- src/accounts/accounts.service.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- @angular/core
- key-vault.service.ts
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
- KeyVaultService
- volumes
- Register
- e2e/helpers.ts
- TransactionsController
- Unlock
- transactions-page.ts
- features/recurring/recurring.service.ts
- RecurringController
- transactions-page.ts
- prisma.service.ts
- transaction-dialog.ts
- backend/src/main.ts
- health.controller.ts
- Delete
- transactions.controller.ts
- recover.ts
- recurring.controller.ts
- TransactionsService
- Recover
- RecurringPage
- PendingOccurrence
- .require
- nest-cli.dev.json
- scripts
- migrate
- key-update.ts
- TransactionDialog
- transaction.model.ts
- redis
- TransactionsService
- healthcheck
- wipeIdentity
- AccountDialog
- CategoriesService
- Home
- default-categories.ts
- backend/README.md
- migrate
- adminer
- Frontend
- .oxlintrc.json
- allowBuilds
- nest-cli.json
- dotenv
- allowBuilds

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 41 edges
2. `@angular/core` - 35 edges
3. `getSodium()` - 34 edges
4. `PrismaService` - 33 edges
5. `RecurringService` - 24 edges
6. `KeyVaultService` - 24 edges
7. `TransactionsService` - 22 edges
8. `AccountsService` - 21 edges
9. `compilerOptions` - 21 edges
10. `@angular/common` - 21 edges

## Surprising Connections (you probably didn't know these)
- `decimal()` --calls--> `parseDecimalInput()`  [EXTRACTED]
  frontend/src/app/features/accounts/account-dialog/account-dialog.ts → frontend/src/app/core/money/decimal.ts
- `newRule()` --calls--> `pick()`  [EXTRACTED]
  frontend/e2e/recurring.e2e.ts → frontend/e2e/helpers.ts
- `RuleDialog` --references--> `Frequency`  [EXTRACTED]
  frontend/src/app/features/recurring/rule-dialog/rule-dialog.ts → frontend/src/app/core/dates/recurrence.ts
- `Page` --references--> `TransactionDto`  [EXTRACTED]
  frontend/src/app/features/transactions/transactions.service.ts → frontend/src/app/features/transactions/transaction.model.ts
- `UpdateKeysRequest` --references--> `DEFAULT_KDF_PARAMS`  [EXTRACTED]
  frontend/src/app/core/crypto/key-vault.service.ts → frontend/src/app/core/crypto/kdf.ts

## Import Cycles
- None detected.

## Communities (74 total, 17 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.13
Nodes (20): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+12 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (42): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+34 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/common@^12.0.1, @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, pg@^8.23.1, @prisma/adapter-pg@7.10.1 (+9 more)

### Community 4 - "backend/package.json"
Cohesion: 0.06
Nodes (42): author, description, devDependencies, @nestjs/cli@^12.0.0, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, oxlint@^1.58.0 (+34 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.13
Nodes (14): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+6 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.11
Nodes (9): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, RedisModule, redis (+1 more)

### Community 7 - "UsersRepository"
Cohesion: 0.10
Nodes (13): AuthModule, RegisterInput, AuthService, JwtAuth, memberKeySignedMessage(), verifyEd25519(), AuthUser, @nestjs/authentication (+5 more)

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.09
Nodes (14): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+6 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.15
Nodes (5): Account, AccountDraft, AccountsPage, AccountsService, toDraft()

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.22
Nodes (14): AppModule, newUser(), payload(), b64(), buildRegistration(), createTestApp(), passphraseUpdate(), registered() (+6 more)

### Community 12 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/router@^22.3.0 (+15 more)

### Community 13 - "@angular/core"
Cohesion: 0.16
Nodes (7): @angular/platform-browser@^22.3.0, App, appConfig, routes, authInterceptor(), TranslocoHttpLoader, @angular/platform-browser

### Community 14 - "key-vault.service.ts"
Cohesion: 0.19
Nodes (23): RegistrationForm, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), FAST_KDF, generateIdentity() (+15 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.20
Nodes (9): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+1 more)

### Community 17 - "RecurringService"
Cohesion: 0.25
Nodes (5): todayIso(), RecurringRule, RuleDraft, RecurringService, scheduleOf()

### Community 18 - "@nestjs/common"
Cohesion: 0.08
Nodes (13): AccountsModule, CategoriesController, CategoriesModule, CurrenciesController, CurrenciesModule, HouseholdAccess, HouseholdAccessService, HouseholdsModule (+5 more)

### Community 19 - "me.controller.ts"
Cohesion: 0.11
Nodes (11): zod@^4.6.7, base64Bytes(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, updateKeysSchema (+3 more)

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

### Community 25 - "KeyVaultService"
Cohesion: 0.21
Nodes (6): MeResponse, Identity, KeyVaultService, UpdateKeysRequest, fromBase64(), SessionService

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (10): createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip(), unlock(), newRule() (+2 more)

### Community 29 - "TransactionsController"
Cohesion: 0.15
Nodes (3): TransactionsController, CreateTransactionsInput, UpdateTransactionsInput

### Community 31 - "transactions-page.ts"
Cohesion: 0.16
Nodes (9): DATE_PROVIDERS, EsArDateAdapter, fromIsoDate(), monthOf(), toIsoDate(), RECURRING_ROUTES, RuleDialog, TRANSACTIONS_ROUTES (+1 more)

### Community 32 - "features/recurring/recurring.service.ts"
Cohesion: 0.27
Nodes (14): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), Frequency, nextOccurrence() (+6 more)

### Community 34 - "transactions-page.ts"
Cohesion: 0.15
Nodes (22): CurrenciesService, Currency, HouseholdContextService, formatMoney(), CARD_NETWORKS, decimal(), ACCOUNT_TYPES, AccountDto (+14 more)

### Community 35 - "prisma.service.ts"
Cohesion: 0.13
Nodes (11): AccountDto, AccountRow, toDto(), toBase64(), toIsoDate(), Env, envSchema, PostOccurrencesInput (+3 more)

### Community 36 - "transaction-dialog.ts"
Cohesion: 0.13
Nodes (25): addDecimals(), compareDecimals(), fromUnits(), isNegative(), negateDecimal(), normalize(), parseDecimalInput(), ARS (+17 more)

### Community 37 - "backend/src/main.ts"
Cohesion: 0.15
Nodes (12): cookie-parser@^1.4.7, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1, @nestjs/swagger@^12.1.2, app, config, cookie-parser (+4 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.16
Nodes (4): DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 39 - "Delete"
Cohesion: 0.14
Nodes (10): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, AuthService, authGuard(), guestGuard(), unlockedGuard() (+2 more)

### Community 40 - "transactions.controller.ts"
Cohesion: 0.19
Nodes (12): isoDate, syncPage(), SyncQuery, syncQuerySchema, uuid, createTransactionsSchema, fields, isTransfer() (+4 more)

### Community 41 - "recover.ts"
Cohesion: 0.15
Nodes (13): RegistrationService, WrongPassphraseError, WrongRecoveryPhraseError, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), sameWord() (+5 more)

### Community 42 - "recurring.controller.ts"
Cohesion: 0.24
Nodes (9): uuid, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, postOccurrencesSchema, ruleFields, UpdateRuleInput (+1 more)

### Community 43 - "TransactionsService"
Cohesion: 0.12
Nodes (4): Transaction, shiftMonth(), TransactionsPage, TransactionsService

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, format, lint, start, start:debug, start:dev (+6 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 51 - "key-update.ts"
Cohesion: 0.33
Nodes (8): KdfParams, concat(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), signKeyUpdate(), VECTOR, utf8()

### Community 53 - "transaction.model.ts"
Cohesion: 0.22
Nodes (7): INFLOW_TYPES, LedgerEntry, TransactionDto, TransactionPayload, TransactionType, Page, SingleDraft

### Community 54 - "redis"
Cohesion: 0.25
Nodes (8): REDIS_PASSWORD, command, environment, image, ports, restart, volumes, redis

### Community 56 - "healthcheck"
Cohesion: 0.53
Nodes (6): interval, retries, test, timeout, healthcheck, healthcheck

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
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `prisma.service.ts`, `dependencies`, `backend/package.json`, `auth.controller.ts`, `UsersRepository`, `src/accounts/accounts.service.ts`, `redis-refresh-token.store.ts`, `health.controller.ts`, `backend/src/main.ts`, `recurring.controller.ts`, `transactions.controller.ts`, `test/helpers.ts`, `me.controller.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `transactions-page.ts` to `frontend/package.json`, `features/recurring/recurring.service.ts`, `transaction-dialog.ts`, `Delete`, `recover.ts`, `dependencies`, `@angular/core`, `key-vault.service.ts`, `KeyVaultService`, `transactions-page.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `e2e/helpers.ts` to `frontend/package.json`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06423034330011074 - nodes in this community are weakly interconnected._