# Graph Report - xp  (2026-11-26)

## Corpus Check
- 132 files · ~34,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 28 file(s) not represented in the graph (top: (none) 13, .scss 9, .example 2)

## Summary
- 1026 nodes · 2144 edges · 74 communities (50 shown, 24 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3d2f108`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- frontend/package.json
- scripts
- frontend
- backend/package.json
- devDependencies
- auth.controller.ts
- redis-refresh-token.store.ts
- UsersRepository
- src/accounts/accounts.service.ts
- features/accounts/accounts.service.ts
- compilerOptions
- test/helpers.ts
- dependencies
- @angular/core
- registration.service.ts
- redis
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- PrismaService
- app.module.ts
- me.controller.ts
- backend-dev
- frontend
- environment
- services
- frontend-dev
- backend
- volumes
- Register
- e2e/helpers.ts
- src/transactions/transactions.service.ts
- Unlock
- transactions-page.ts
- Login
- oxlint-tsgolint@^7.0.2001
- account-dialog.ts
- PrismaService
- features/transactions/transactions.service.ts
- dependencies
- health.controller.ts
- home.ts
- libsodium-wrappers-sumo
- @angular/core
- RedisModule
- TransactionsPage
- Recover
- @nestjs/cli@^12.0.0
- HealthController
- frontend/package.json
- nest-cli.dev.json
- scripts
- migrate
- @nestjs/mau@^0.2.6
- @nestjs/schematics@^12.0.0
- @types/cookie-parser@^1.4.10
- @types/node@^24.0.0
- @types/pg@^8.23.1
- @types/supertest@^7.0.0
- vite@^8.0.0
- vitest@^4.1.2
- @fontsource/roboto@5.3.0
- material-symbols@0.49.0
- tslib@^2.3.0
- uuid
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
1. `@nestjs/common` - 37 edges
2. `getSodium()` - 34 edges
3. `@angular/core` - 31 edges
4. `PrismaService` - 30 edges
5. `KeyVaultService` - 23 edges
6. `compilerOptions` - 21 edges
7. `TransactionsService` - 18 edges
8. `@angular/common` - 17 edges
9. `@angular/material` - 17 edges
10. `@jsverse/transloco` - 17 edges

## Surprising Connections (you probably didn't know these)
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/transactions/transactions.service.ts → backend/src/common/base64.ts
- `payload()` --calls--> `b64()`  [EXTRACTED]
  backend/test/accounts.e2e-spec.ts → backend/test/helpers.ts
- `newUser()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/accounts.e2e-spec.ts → backend/test/helpers.ts
- `registered()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/keys.e2e-spec.ts → backend/test/helpers.ts

## Import Cycles
- None detected.

## Communities (74 total, 24 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.14
Nodes (14): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, typescript@~6.0.2, vitest@^5.0.0 (+6 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (42): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+34 more)

### Community 3 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, pg@^8.23.1, @prisma/client@7.10.1, reflect-metadata@^0.2.2, rxjs@^7.8.1, description, rxjs, license (+7 more)

### Community 4 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, @nestjs/testing@^12.0.1, oxlint@^1.58.0, prettier@^3.4.2, source-map-support@^0.5.21, supertest@^7.0.0, @types/express@^5.0.0, typescript@^6.0.2 (+8 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.12
Nodes (15): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+7 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "UsersRepository"
Cohesion: 0.12
Nodes (7): AuthService, JwtAuth, AuthUser, @nestjs/authentication, AuthenticationTypes, authUserSelect, UsersRepository

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.08
Nodes (16): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+8 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.10
Nodes (12): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon(), AccountPayload, AccountType (+4 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+18 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.20
Nodes (15): memberKeySignedMessage(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, newUser(), payload(), b64() (+7 more)

### Community 12 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0, @angular/router@^22.3.0 (+7 more)

### Community 13 - "@angular/core"
Cohesion: 0.18
Nodes (8): App, appConfig, routes, authGuard(), guestGuard(), unlockedGuard(), TranslocoHttpLoader, @angular/router

### Community 14 - "registration.service.ts"
Cohesion: 0.08
Nodes (48): MeResponse, RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad() (+40 more)

### Community 15 - "redis"
Cohesion: 0.10
Nodes (23): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, REDIS_PASSWORD, interval, retries, test, timeout (+15 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.20
Nodes (9): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+1 more)

### Community 18 - "app.module.ts"
Cohesion: 0.11
Nodes (15): AccountsModule, AppModule, AuthModule, CategoriesModule, Env, envSchema, HouseholdAccess, HouseholdsModule (+7 more)

### Community 19 - "me.controller.ts"
Cohesion: 0.12
Nodes (10): verifyEd25519(), base64Bytes(), toBase64(), UpdateKeysInput, updateKeysSchema, KeysService, MeController, UsersModule (+2 more)

### Community 20 - "backend-dev"
Cohesion: 0.29
Nodes (7): depends_on, ports, profiles, volumes, redis, condition, backend-dev

### Community 21 - "frontend"
Cohesion: 0.20
Nodes (10): condition, backend, BACKEND_UPSTREAM, build, depends_on, environment, ports, profiles (+2 more)

### Community 22 - "environment"
Cohesion: 0.44
Nodes (9): environment, environment, CORS_ORIGINS, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT, REDIS_URL (+1 more)

### Community 23 - "services"
Cohesion: 0.25
Nodes (7): name, services, x-backend-env, DATABASE_URL, JWT_SECRET, PORT, REDIS_URL

### Community 24 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 25 - "backend"
Cohesion: 0.33
Nodes (6): depends_on, profiles, restart, migrate, condition, backend

### Community 26 - "volumes"
Cohesion: 0.29
Nodes (7): volumes, backend-dist, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.27
Nodes (9): createAccount(), nextIn(), pick(), readPhrase(), registerViaUi(), strip(), unlock(), newTransaction() (+1 more)

### Community 29 - "src/transactions/transactions.service.ts"
Cohesion: 0.08
Nodes (20): isoDate, syncPage(), SyncQuery, syncQuerySchema, toIsoDate(), TransactionsController, uuid, CreateTransactionsInput (+12 more)

### Community 31 - "transactions-page.ts"
Cohesion: 0.15
Nodes (12): DATE_PROVIDERS, EsArDateAdapter, fromIsoDate(), monthOf(), todayIso(), toIsoDate(), CategoriesService, Category (+4 more)

### Community 34 - "account-dialog.ts"
Cohesion: 0.22
Nodes (7): CurrenciesService, Currency, CARD_NETWORKS, ConfirmData, ConfirmDialog, confirmDialog(), @angular/common

### Community 35 - "PrismaService"
Cohesion: 0.13
Nodes (5): AccountDto, AccountRow, CategoriesController, HouseholdAccessService, PrismaService

### Community 36 - "features/transactions/transactions.service.ts"
Cohesion: 0.07
Nodes (34): addDecimals(), compareDecimals(), fromUnits(), isNegative(), negateDecimal(), normalize(), parseDecimalInput(), ARS (+26 more)

### Community 37 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1 (+8 more)

### Community 38 - "health.controller.ts"
Cohesion: 0.24
Nodes (5): @nestjs/throttler@^6.8.0, DatabaseHealthIndicator, HealthModule, @nestjs/terminus, @nestjs/throttler

### Community 39 - "home.ts"
Cohesion: 0.15
Nodes (7): HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, authInterceptor(), AuthService, Home

### Community 41 - "@angular/core"
Cohesion: 0.24
Nodes (8): WrongPassphraseError, SessionService, CURRENCIES, differentFrom(), matchValidator(), @angular/core, @angular/forms, @jsverse/transloco

### Community 43 - "TransactionsPage"
Cohesion: 0.15
Nodes (4): formatMoney(), LedgerEntry, shiftMonth(), TransactionsPage

### Community 47 - "frontend/package.json"
Cohesion: 0.22
Nodes (8): @angular/cdk@22.3.0, prettier@^3.8.1, prettier, name, packageManager, private, version, @angular/cdk

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, format, lint, start, start:debug, start:dev (+6 more)

### Community 50 - "migrate"
Cohesion: 0.33
Nodes (6): postgres, depends_on, profiles, restart, condition, migrate

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 87 - "migrate"
Cohesion: 0.53
Nodes (6): build, build, context, target, build, build

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
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `app.module.ts` to `PrismaService`, `backend/package.json`, `auth.controller.ts`, `dependencies`, `UsersRepository`, `src/accounts/accounts.service.ts`, `redis-refresh-token.store.ts`, `health.controller.ts`, `test/helpers.ts`, `PrismaService`, `me.controller.ts`, `src/transactions/transactions.service.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `Login`, `account-dialog.ts`, `features/transactions/transactions.service.ts`, `home.ts`, `features/accounts/accounts.service.ts`, `dependencies`, `@angular/core`, `registration.service.ts`, `frontend/package.json`, `transactions-page.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/authentication` connect `me.controller.ts` to `backend/package.json`, `auth.controller.ts`, `dependencies`, `UsersRepository`, `src/accounts/accounts.service.ts`, `redis-refresh-token.store.ts`, `health.controller.ts`, `test/helpers.ts`, `app.module.ts`, `src/transactions/transactions.service.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._