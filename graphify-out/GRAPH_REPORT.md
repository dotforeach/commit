# Graph Report - xp  (2026-11-26)

## Corpus Check
- 111 files · ~26,979 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 27 file(s) not represented in the graph (top: (none) 13, .scss 7, .example 2)

## Summary
- 859 nodes · 1689 edges · 66 communities (45 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

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
- .updateKeys
- backend-dev
- frontend
- environment
- services
- frontend-dev
- backend
- volumes
- Register
- e2e/helpers.ts
- @nestjs/common
- Unlock
- Home
- Login
- oxlint-tsgolint@^7.0.2001
- account-dialog.ts
- keys.service.ts
- decimal.ts
- dependencies
- @nestjs/common
- AuthService
- uuid
- AccountsPage
- RedisModule
- app.routes.ts
- Recover
- @nestjs/cli@^12.0.0
- oxlint@^1.58.0
- @types/express@^5.0.0
- scripts
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
1. `getSodium()` - 34 edges
2. `@nestjs/common` - 31 edges
3. `PrismaService` - 25 edges
4. `@angular/core` - 24 edges
5. `KeyVaultService` - 21 edges
6. `compilerOptions` - 20 edges
7. `AuthService` - 15 edges
8. `@jsverse/transloco` - 15 edges
9. `AccountsService` - 14 edges
10. `@angular/router` - 14 edges

## Surprising Connections (you probably didn't know these)
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `passphraseUpdate()` --calls--> `keyUpdateSignedMessage()`  [EXTRACTED]
  backend/test/keys.e2e-spec.ts → backend/src/users/key-update-signature.ts
- `payload()` --calls--> `b64()`  [EXTRACTED]
  backend/test/accounts.e2e-spec.ts → backend/test/helpers.ts
- `newUser()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/accounts.e2e-spec.ts → backend/test/helpers.ts
- `registered()` --calls--> `buildRegistration()`  [EXTRACTED]
  backend/test/keys.e2e-spec.ts → backend/test/helpers.ts

## Import Cycles
- None detected.

## Communities (66 total, 21 thin omitted)

### Community 0 - "frontend/package.json"
Cohesion: 0.13
Nodes (20): devDependencies, @angular/build@^22.3.0, @angular/cli@^22.3.0, @angular/compiler-cli@^22.3.0, jsdom@^31.0.0, @playwright/test@^1.65.1, prettier@^3.8.1, typescript@~6.0.2 (+12 more)

### Community 1 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, e2e, ng, start, test, watch

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (42): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+34 more)

### Community 3 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, description, source-map-support@^0.5.21, @types/node@^24.0.0, @types/pg@^8.23.1, vite@^8.0.0, license, name (+7 more)

### Community 4 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, @nestjs/mau@^0.2.6, @nestjs/schematics@^12.0.0, @nestjs/testing@^12.0.1, prettier@^3.4.2, supertest@^7.0.0, @types/cookie-parser@^1.4.10, @types/supertest@^7.0.0 (+11 more)

### Community 5 - "auth.controller.ts"
Cohesion: 0.11
Nodes (17): AuthController, CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema (+9 more)

### Community 6 - "redis-refresh-token.store.ts"
Cohesion: 0.16
Nodes (8): familyRevokedKey(), RedisRefreshTokenStore, StoredRecord, tokenKey(), userFamiliesKey(), REDIS, redis, ioredis

### Community 7 - "UsersRepository"
Cohesion: 0.18
Nodes (4): AuthService, JwtAuth, AuthUser, UsersRepository

### Community 8 - "src/accounts/accounts.service.ts"
Cohesion: 0.06
Nodes (21): AccountsController, uuid, AccountsModule, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage (+13 more)

### Community 9 - "features/accounts/accounts.service.ts"
Cohesion: 0.21
Nodes (9): Account, ACCOUNT_TYPES, AccountDraft, AccountDto, accountIcon(), AccountPayload, CreditCardPayload, AccountsService (+1 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (25): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+17 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.31
Nodes (9): memberKeySignedMessage(), newUser(), payload(), b64(), buildRegistration(), createTestApp(), passphraseUpdate(), registered() (+1 more)

### Community 12 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+15 more)

### Community 13 - "@angular/core"
Cohesion: 0.19
Nodes (8): App, appConfig, routes, authInterceptor(), TranslocoHttpLoader, @angular/common, @angular/core, @jsverse/transloco

### Community 14 - "registration.service.ts"
Cohesion: 0.06
Nodes (58): HouseholdPayload, MeHousehold, MeResponse, RegisterRequest, RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt() (+50 more)

### Community 15 - "redis"
Cohesion: 0.10
Nodes (23): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, REDIS_PASSWORD, interval, retries, test, timeout (+15 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.20
Nodes (9): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege, Qué queda en claro y qué se cifra (modo híbrido) (+1 more)

### Community 17 - "PrismaService"
Cohesion: 0.16
Nodes (3): CurrenciesController, CurrenciesModule, PrismaService

### Community 18 - "app.module.ts"
Cohesion: 0.14
Nodes (12): AppModule, AuthModule, Env, envSchema, app, config, PrismaModule, cookie-parser (+4 more)

### Community 20 - "backend-dev"
Cohesion: 0.20
Nodes (10): depends_on, ports, profiles, volumes, postgres, redis, depends_on, condition (+2 more)

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

### Community 25 - "backend"
Cohesion: 0.33
Nodes (6): depends_on, profiles, restart, migrate, condition, backend

### Community 26 - "volumes"
Cohesion: 0.33
Nodes (6): volumes, backend-node-modules, frontend-angular-cache, frontend-node-modules, postgres-data, redis-data

### Community 28 - "e2e/helpers.ts"
Cohesion: 0.44
Nodes (5): readPhrase(), registerViaUi(), strip(), unlock(), @playwright/test

### Community 29 - "@nestjs/common"
Cohesion: 0.20
Nodes (7): HouseholdAccess, @nestjs/authentication, AuthenticationTypes, UsersModule, authUserSelect, @nestjs/authentication, @nestjs/common

### Community 34 - "account-dialog.ts"
Cohesion: 0.16
Nodes (9): CurrenciesService, Currency, AccountDialog, CARD_NETWORKS, AccountType, ConfirmData, ConfirmDialog, confirmDialog() (+1 more)

### Community 35 - "keys.service.ts"
Cohesion: 0.19
Nodes (8): RegisterInput, verifyEd25519(), KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR, UpdateKeysInput, KeysService

### Community 36 - "decimal.ts"
Cohesion: 0.22
Nodes (8): formatMoney(), normalize(), parseDecimalInput(), ARS, BTC, stripThousands(), toInputValue(), decimal()

### Community 37 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, cookie-parser@^1.4.7, ioredis@^6.1.0, @nestjs/authentication@^0.1.7, @nestjs/common@^12.0.1, @nestjs/config@^12.1.1, @nestjs/core@^12.0.1, @nestjs/platform-express@^12.0.1 (+15 more)

### Community 38 - "@nestjs/common"
Cohesion: 0.15
Nodes (5): @nestjs/terminus@^12.2.0, DatabaseHealthIndicator, HealthController, HealthModule, @nestjs/terminus

### Community 40 - "uuid"
Cohesion: 0.33
Nodes (4): libsodium-wrappers-sumo@^0.8.4, uuid@^14.0.3, libsodium-wrappers-sumo, uuid

### Community 43 - "app.routes.ts"
Cohesion: 0.70
Nodes (3): authGuard(), guestGuard(), unlockedGuard()

### Community 49 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, deploy, format, lint, start, start:debug, start:dev (+6 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 87 - "migrate"
Cohesion: 0.29
Nodes (10): build, build, context, target, build, build, build, profiles (+2 more)

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
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `backend/package.json`, `keys.service.ts`, `auth.controller.ts`, `dependencies`, `redis-refresh-token.store.ts`, `src/accounts/accounts.service.ts`, `@nestjs/common`, `test/helpers.ts`, `PrismaService`, `app.module.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `frontend/package.json`, `account-dialog.ts`, `features/accounts/accounts.service.ts`, `app.routes.ts`, `dependencies`, `registration.service.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.048726467331118496 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/authentication` connect `@nestjs/common` to `backend/package.json`, `auth.controller.ts`, `dependencies`, `redis-refresh-token.store.ts`, `src/accounts/accounts.service.ts`, `@nestjs/common`, `test/helpers.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._