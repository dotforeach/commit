# Graph Report - commit  (2026-11-27)

## Corpus Check
- 349 files · ~163,830 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 50 file(s) not represented in the graph (top: .scss 26, (none) 15, .example 2)

## Summary
- 2881 nodes · 7257 edges · 139 communities (89 shown, 50 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 211 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `801b0938`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SavingsService
- scripts
- frontend
- members.ts
- backend/package.json
- .login
- RedisRefreshTokenStore
- articles.ts
- accounts.schemas.ts
- progress-engine.ts
- compilerOptions
- test/helpers.ts
- dependencies
- DebtsService
- rates.controller.ts
- postgres
- Arquitectura de cifrado (conocimiento cero, modo híbrido)
- RecurringService
- debit-card-page.ts
- Transaction
- backend-dev
- frontend
- environment
- x-backend-env
- frontend-dev
- TransactionsPage
- src/receipts/receipts.service.ts
- auth.controller.ts
- ReceiptsService
- Env
- rates-page.ts
- progress-engine.ts
- app.module.ts
- ProgressController
- deposits.ts
- recommend.ts
- DepositsService
- DepositsService
- health.controller.ts
- budgets/budgets.service.ts
- recurring.schemas.ts
- installments/installments.service.ts
- progress.service.ts
- InvestmentsService
- @angular/core
- getSodium
- budget-math.ts
- nest-cli.dev.json
- scripts
- toBase64
- .deleteAccount
- Account
- redis
- BudgetPage
- card-statement.ts
- AccountService
- PrismaService
- src/transactions/transactions.service.ts
- account.controller.ts
- recurring-page.ts
- tools-math.ts
- e2e/helpers.ts
- backend/README.md
- Converter
- AppMailer
- .require
- Commit 🐷
- MembersService
- session-keys.ts
- ledger.ts
- parseDecimalInput
- app.py
- BudgetsService
- HouseholdService
- home.ts
- HouseholdPage
- registration.service.ts
- ledger.ts
- ReceiptsService
- ngsw-config.json
- debts-page.ts
- Recover
- plan-engine.ts
- Register
- Facturas por WhatsApp
- OnboardingPage
- savings-page.ts
- AccountService
- debt-math.ts
- .require
- adminer
- AccountsPage
- Frontend
- base64.ts
- PlanPage
- Operación
- services
- KeyVaultService
- .oxlintrc.json
- InstallmentsService
- PlanService
- allowBuilds
- RemindersService
- nest-cli.json
- subset.py
- key-vault.service.ts
- StatusPage
- AccountSecurityCard
- SubscriptionPage
- allowBuilds
- crypto.spec.ts
- scan.mjs
- core/auth/auth.service.ts
- RedisModule
- PlanPage
- CreditCardPage
- FakePush
- Login
- SettingsPage
- ProgressService
- NotificationsController
- keyFingerprint
- Arquitectura
- Flujos principales
- Variables de entorno
- ForgotPasswordPage
- ResetPasswordPage
- VerifyEmailPage
- ArticlePage
- CreditCardPage
- DebitCardPage
- MortgagePage

## God Nodes (most connected - your core abstractions)
1. `@angular/core` - 90 edges
2. `@nestjs/common` - 88 edges
3. `PrismaService` - 74 edges
4. `@angular/material` - 57 edges
5. `@jsverse/transloco` - 57 edges
6. `parseDecimalInput()` - 57 edges
7. `@angular/common` - 49 edges
8. `@angular/router` - 47 edges
9. `KeyVaultService` - 46 edges
10. `toBase64()` - 38 edges

## Surprising Connections (you probably didn't know these)
- `Code scaffolding` --references--> `components`  [INFERRED]
  frontend/README.md → frontend/src/app/core/api/openapi.d.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/accounts/accounts.service.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/budgets/budgets.service.ts → backend/src/common/base64.ts
- `dto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/deposits/deposits.ts → backend/src/common/base64.ts
- `toDto()` --calls--> `toBase64()`  [EXTRACTED]
  backend/src/transactions/transactions.service.ts → backend/src/common/base64.ts

## Import Cycles
- None detected.

## Communities (139 total, 50 thin omitted)

### Community 0 - "SavingsService"
Cohesion: 0.08
Nodes (12): Asset, Contribution, Deposit, DepositPayload, Goal, GoalDraft, GoalPayload, GoalStatus (+4 more)

### Community 1 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, api:types, build, e2e, icons:check, icons:subset, ng, start (+2 more)

### Community 2 - "frontend"
Cohesion: 0.05
Nodes (44): build, serve, test, builder, configurations, defaultConfiguration, options, cli (+36 more)

### Community 3 - "members.ts"
Cohesion: 0.13
Nodes (13): @nestjs/terminus@^12.2.0, @nestjs/throttler@^6.8.0, HealthModule, accept, defaultHousehold, grant, invite, role (+5 more)

### Community 4 - "backend/package.json"
Cohesion: 0.03
Nodes (87): author, dependencies, @anthropic-ai/sdk@^1.14.0, bullmq@^6.7.10, cookie-parser@^1.4.7, ioredis@^6.1.0, libsodium-wrappers@^0.8.4, @nestjs/authentication@^0.1.7 (+79 more)

### Community 5 - ".login"
Cohesion: 0.25
Nodes (5): AuthController, clearRefreshCookie(), cookieOptions(), setDeviceCookie(), setRefreshCookie()

### Community 6 - "RedisRefreshTokenStore"
Cohesion: 0.22
Nodes (4): familyRevokedKey(), RedisRefreshTokenStore, tokenKey(), userFamiliesKey()

### Community 7 - "articles.ts"
Cohesion: 0.12
Nodes (20): FEATURED, FEATURES, Landing, Article, Block, Level, LEVELS, readingMinutes() (+12 more)

### Community 8 - "accounts.schemas.ts"
Cohesion: 0.09
Nodes (16): AccountsController, uuid, accountFields, accountTypeSchema, CreateAccountInput, createAccountSchema, creditCardMessage, creditCardSchema (+8 more)

### Community 9 - "progress-engine.ts"
Cohesion: 0.17
Nodes (6): Frequency, PendingList, PendingOccurrence, RuleDto, RulePayload, RuleDialog

### Community 10 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, rootDir, exclude, extends, include, compilerOptions, allowSyntheticDefaultImports, declaration (+22 more)

### Community 11 - "test/helpers.ts"
Cohesion: 0.11
Nodes (30): memberKeySignedMessage(), cookieOf(), register(), newUser(), payload(), payload(), setup(), payload() (+22 more)

### Community 12 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @angular/cdk@22.3.0, @angular/common@^22.3.0, @angular/compiler@^22.3.0, @angular/core@^22.3.0, @angular/forms@^22.3.0, @angular/material@22.3.0, @angular/platform-browser@^22.3.0 (+17 more)

### Community 13 - "DebtsService"
Cohesion: 0.09
Nodes (13): DebtDialog, Amortization, Debt, DebtDraft, DebtDto, DebtKind, DebtPayload, DebtPayment (+5 more)

### Community 14 - "rates.controller.ts"
Cohesion: 0.15
Nodes (10): coinGecko, COINS, DOLAR_CASAS, dolarApiItem, FIXED, frankfurter, mid(), PublicRate (+2 more)

### Community 15 - "postgres"
Cohesion: 0.22
Nodes (9): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+1 more)

### Community 16 - "Arquitectura de cifrado (conocimiento cero, modo híbrido)"
Cohesion: 0.18
Nodes (11): Arquitectura de cifrado (conocimiento cero, modo híbrido), Caché offline, Dos secretos por usuario, Excepción: facturas por WhatsApp, Flujos, Formato del payload, Jerarquía de claves, Lo que el cifrado NO protege (+3 more)

### Community 17 - "RecurringService"
Cohesion: 0.10
Nodes (16): addDays(), daysInMonth(), DueOccurrences, dueOccurrences(), firstOccurrence(), format(), nextOccurrence(), parse() (+8 more)

### Community 18 - "debit-card-page.ts"
Cohesion: 0.16
Nodes (16): ACODECO_MAY_2026, BankRate, CARD_RATES, CHECKED_AT, MORTGAGE_RATES, MORTGAGE_SYSTEM_AVERAGE, RateSource, SAVINGS_RULE (+8 more)

### Community 19 - "Transaction"
Cohesion: 0.13
Nodes (7): BudgetContext, cat(), ctx(), Category, Transaction, TransactionDto, Page

### Community 20 - "backend-dev"
Cohesion: 0.10
Nodes (26): build, depends_on, build, depends_on, ports, profiles, volumes, profiles (+18 more)

### Community 21 - "frontend"
Cohesion: 0.22
Nodes (9): condition, backend, BACKEND_UPSTREAM, depends_on, environment, ports, profiles, restart (+1 more)

### Community 22 - "environment"
Cohesion: 0.17
Nodes (30): environment, environment, ANTHROPIC_API_KEY, APP_URL, AUTH_RATE_LIMIT, CORS_ORIGINS, DATABASE_URL, EXTRACTION_MODEL (+22 more)

### Community 23 - "x-backend-env"
Cohesion: 0.08
Nodes (24): x-backend-env, ANTHROPIC_API_KEY, DATABASE_URL, EXTRACTION_MODEL, JWT_SECRET, MAIL_FROM, OCR_URL, PHONE_HASH_KEY (+16 more)

### Community 24 - "frontend-dev"
Cohesion: 0.29
Nodes (7): API_PROXY_TARGET, depends_on, environment, ports, profiles, volumes, frontend-dev

### Community 25 - "TransactionsPage"
Cohesion: 0.10
Nodes (4): TransactionDialog, LedgerEntry, shiftMonth(), TransactionsPage

### Community 26 - "src/receipts/receipts.service.ts"
Cohesion: 0.05
Nodes (34): AuthModule, StoredRecord, Env, DisabledMailTransport, NotificationsModule, PushService, DueReminder, ExtractorService (+26 more)

### Community 27 - "auth.controller.ts"
Cohesion: 0.11
Nodes (14): CREDENTIALS_LIMIT, SESSION_LIMIT, categorySchema, Credentials, credentialsSchema, encryptedPayload, kdfParamsSchema, RegisterInput (+6 more)

### Community 28 - "ReceiptsService"
Cohesion: 0.06
Nodes (8): ReceiptExtraction, extractMessages(), ReceiptsController, fmt(), ReceiptsProcessor, linkKey(), ReceiptsService, SealedReceipt

### Community 29 - "Env"
Cohesion: 0.10
Nodes (9): HouseholdRatesController, HouseholdRatesService, PublicRatesController, RatesModule, RATES_QUEUE, RatesProcessor, RatesScheduler, RatesService (+1 more)

### Community 30 - "rates-page.ts"
Cohesion: 0.14
Nodes (5): RatesPage, RELEVANT, USD_TYPES, ManualRate, RatesService

### Community 31 - "progress-engine.ts"
Cohesion: 0.13
Nodes (18): Check, clamp01(), ComponentKey, emergencyMonths(), FinanceSnapshot, HealthScore, healthScore(), Level (+10 more)

### Community 32 - "app.module.ts"
Cohesion: 0.06
Nodes (17): AccountsModule, BudgetsModule, CategoriesModule, envSchema, CurrenciesController, CurrenciesModule, DebtsModule, DepositsModule (+9 more)

### Community 34 - "deposits.ts"
Cohesion: 0.04
Nodes (58): uuid, budgetFields, createBudgetSchema, encryptedPayload, itemSchema, UpdateBudgetInput, updateBudgetSchema, Item (+50 more)

### Community 35 - "recommend.ts"
Cohesion: 0.09
Nodes (18): GenericCategory, InboxReceipt, ReceiptExtraction, mostCommon(), norm(), Reason, RecAccount, RecCategory (+10 more)

### Community 37 - "DepositsService"
Cohesion: 0.14
Nodes (3): DepositsController, DepositsService, dto()

### Community 40 - "budgets/budgets.service.ts"
Cohesion: 0.13
Nodes (4): BudgetsController, CreateBudgetInput, BudgetsService, toDto()

### Community 41 - "recurring.schemas.ts"
Cohesion: 0.09
Nodes (12): RecurringController, uuid, RecurringModule, coherentMessage, CreateRuleInput, createRuleSchema, encryptedPayload, postOccurrencesSchema (+4 more)

### Community 43 - "progress.service.ts"
Cohesion: 0.09
Nodes (31): Method, RequestBody, CreateAccount, CreateTransactions, KeyVaultService, HouseholdContextService, OfflineCacheService, AccountsService (+23 more)

### Community 45 - "@angular/core"
Cohesion: 0.06
Nodes (47): license, name, packageManager, private, version, NAV, NavItem, authGuard() (+39 more)

### Community 46 - "getSodium"
Cohesion: 0.19
Nodes (16): deriveKeyFromPassphrase(), deriveOnMainThread(), KdfParams, kdfWorker(), pending, randomSalt(), concat(), KeyUpdateFields (+8 more)

### Community 47 - "budget-math.ts"
Cohesion: 0.17
Nodes (21): addDecimals(), fromUnits(), percentOf(), ratioOf(), BTC, PAB, USD, subDecimals() (+13 more)

### Community 48 - "nest-cli.dev.json"
Cohesion: 0.29
Nodes (6): collection, compilerOptions, deleteOutDir, tsConfigPath, $schema, sourceRoot

### Community 49 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, deploy, format, lint, openapi, start, start:debug (+8 more)

### Community 50 - "toBase64"
Cohesion: 0.15
Nodes (11): toBase64(), toIsoDate(), paymentDto(), toDto(), dto(), toDto(), assetDto(), priceDto() (+3 more)

### Community 52 - "Account"
Cohesion: 0.10
Nodes (10): AccountDialog, Account, ACCOUNT_TYPES, AccountDraft, AccountDto, AccountPayload, AccountType, CreditCardPayload (+2 more)

### Community 54 - "redis"
Cohesion: 0.18
Nodes (14): REDIS_PASSWORD, interval, retries, test, timeout, healthcheck, command, environment (+6 more)

### Community 56 - "card-statement.ts"
Cohesion: 0.17
Nodes (18): closingDate(), Cycle, cycleFor(), daysIn(), installmentMonths(), iso(), pad(), shift() (+10 more)

### Community 57 - "AccountService"
Cohesion: 0.21
Nodes (3): AccountService, deviceLabel(), sha256()

### Community 58 - "PrismaService"
Cohesion: 0.06
Nodes (15): AccountDto, AccountRow, CategoriesController, HouseholdAccess, HouseholdAccessService, uuid, CreatePlanInput, createPlanSchema (+7 more)

### Community 59 - "src/transactions/transactions.service.ts"
Cohesion: 0.13
Nodes (6): SyncQuery, TransactionsController, CreateTransactionsInput, UpdateTransactionsInput, toDto(), TransactionsService

### Community 60 - "account.controller.ts"
Cohesion: 0.19
Nodes (16): RESEND, STRICT, ChangeEmailInput, changeEmailSchema, ChangePasswordInput, changePasswordSchema, DeleteAccountInput, deleteAccountSchema (+8 more)

### Community 62 - "tools-math.ts"
Cohesion: 0.20
Nodes (16): CardPayoff, cardPayoff(), CardPayoffInput, compoundGrowth(), CompoundInput, CompoundYear, DebitAccountInput, debitAnnualCost() (+8 more)

### Community 63 - "e2e/helpers.ts"
Cohesion: 0.06
Nodes (37): expense(), newDebt(), createAccount(), mailLink(), nextIn(), pick(), readPhrase(), registerViaUi() (+29 more)

### Community 64 - "backend/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 65 - "Converter"
Cohesion: 0.15
Nodes (9): computeNetWorth(), NetWorth, NetWorthItem, round2(), converter, Converter, ConverterOptions, Quote (+1 more)

### Community 67 - ".require"
Cohesion: 0.10
Nodes (11): DebtsController, uuid, CreateDebtInput, createDebtSchema, CreatePaymentInput, createPaymentSchema, debtFields, encryptedPayload (+3 more)

### Community 68 - "Commit 🐷"
Cohesion: 0.20
Nodes (10): Arquitectura en una imagen, Commit 🐷, Contrato de la API, Documentación, Levantar, Licencia, Qué incluye, Servicios opcionales (+2 more)

### Community 69 - "MembersService"
Cohesion: 0.13
Nodes (4): verifyEd25519(), hashToken(), MembersController, MembersService

### Community 70 - "session-keys.ts"
Cohesion: 0.19
Nodes (13): AutoLockService, b64(), cleanupOrphans(), db(), forgetIdentity(), idb(), packIdentity(), persistIdentity() (+5 more)

### Community 71 - "ledger.ts"
Cohesion: 0.23
Nodes (9): negateDecimal(), AccountBalance, buildLedger(), computeBalances(), CurrencyTotals, idOf(), isLiability(), signedAmount() (+1 more)

### Community 72 - "parseDecimalInput"
Cohesion: 0.07
Nodes (32): EsArDateAdapter, fromIsoDate(), todayIso(), toIsoDate(), compareDecimals(), normalize(), parseDecimalInput(), stripThousands() (+24 more)

### Community 73 - "app.py"
Cohesion: 0.19
Nodes (3): health(), read(), _texts()

### Community 74 - "BudgetsService"
Cohesion: 0.13
Nodes (8): BudgetDialog, Budget, BudgetDraft, BudgetDto, BudgetItem, BudgetItemDto, BudgetMethod, BudgetsService

### Community 78 - "registration.service.ts"
Cohesion: 0.17
Nodes (14): RegistrationForm, RegistrationService, aeadDecrypt(), aeadEncrypt(), decryptPayload(), encryptPayload(), payloadAad(), generateIdentity() (+6 more)

### Community 81 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 82 - "debts-page.ts"
Cohesion: 0.11
Nodes (21): CurrenciesService, Currency, monthOf(), formatMoney(), isNegative(), THOUSANDS, toInputValue(), CARD_NETWORKS (+13 more)

### Community 84 - "plan-engine.ts"
Cohesion: 0.27
Nodes (8): RateType, buildPlan(), effectiveRate(), pick(), PlanDebt, PlanInput, PlanResult, round2()

### Community 87 - "Facturas por WhatsApp"
Cohesion: 0.25
Nodes (8): Componentes, Configurar Meta (WhatsApp Cloud API), Costos aproximados por persona y mes, Cómo se recomienda la cuenta y la categoría, Facturas por WhatsApp, Pendiente, Privacidad: una excepción explícita al conocimiento cero, Probar sin Meta ni IA (desarrollo)

### Community 89 - "savings-page.ts"
Cohesion: 0.14
Nodes (19): NUMBER_LOCALE, ZERO, TradeDialog, toMoneyString(), averageMonthlyExpenses(), cashAmount(), computeHoldings(), daysBetween() (+11 more)

### Community 91 - "debt-math.ts"
Cohesion: 0.36
Nodes (10): amortizationSchedule(), frenchPayment(), monthlyRate(), outstandingBalance(), round2(), ScheduleRow, simulatePayoff(), StrategyDebt (+2 more)

### Community 92 - ".require"
Cohesion: 0.33
Nodes (6): at9(), daysIn(), nextDay(), PlanInput, PlannedReminder, planReminders()

### Community 93 - "adminer"
Cohesion: 0.25
Nodes (8): depends_on, environment, image, ports, profiles, restart, ADMINER_DEFAULT_SERVER, adminer

### Community 95 - "Frontend"
Cohesion: 0.14
Nodes (12): Additional Resources, Building, Code scaffolding, Development server, Frontend, Running end-to-end tests, Running unit tests, components (+4 more)

### Community 96 - "base64.ts"
Cohesion: 0.06
Nodes (19): TTL, JwtAuth, AppMailModule, Recipient, KeyUpdateFields, keyUpdateSignedMessage(), lengthPrefixed(), KEY_UPDATE_VECTOR (+11 more)

### Community 98 - "Operación"
Cohesion: 0.25
Nodes (8): Entornos, Estado de la infraestructura (`/estado`), Mantener contenidos, Migraciones, Operación, Seguridad operativa, Tests, Íconos

### Community 99 - "services"
Cohesion: 0.10
Nodes (19): image, ports, profiles, restart, name, build, ports, profiles (+11 more)

### Community 100 - "KeyVaultService"
Cohesion: 0.19
Nodes (6): MeResponse, Identity, DEFAULT_KDF_PARAMS, UpdateKeysRequest, WrongPassphraseError, WrongRecoveryPhraseError

### Community 101 - ".oxlintrc.json"
Cohesion: 0.29
Nodes (6): env, node, rules, typescript/no-explicit-any, typescript/no-floating-promises, $schema

### Community 104 - "allowBuilds"
Cohesion: 0.29
Nodes (6): allowBuilds, esbuild, lmdb, msgpackr-extract, @parcel/watcher, packages

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 108 - "key-vault.service.ts"
Cohesion: 0.33
Nodes (4): generateHouseholdKey(), memberKeySignedMessage(), unwrapHouseholdKey(), wrapHouseholdKey()

### Community 112 - "allowBuilds"
Cohesion: 0.33
Nodes (5): allowBuilds, msgpackr-extract, prisma, @prisma/engines, @scarf/scarf

### Community 113 - "crypto.spec.ts"
Cohesion: 0.38
Nodes (8): FAST_KDF, byFolded, fold(), generateRecoveryPhrase(), normalizeRecoveryPhrase(), recoveryKeyFromPhrase(), sameWord(), @scure/bip39

### Community 114 - "scan.mjs"
Cohesion: 0.25
Nodes (4): files(), manifestPath, root, usedIcons()

### Community 115 - "core/auth/auth.service.ts"
Cohesion: 0.08
Nodes (12): App, appConfig, routes, HouseholdPayload, MeHousehold, RegisterRequest, TokenResponse, authInterceptor() (+4 more)

### Community 127 - "Arquitectura"
Cohesion: 0.33
Nodes (6): Arquitectura, Backend: módulos, Componentes y despliegue, Decisiones clave, Frontend: áreas, Modelo de datos (simplificado)

### Community 128 - "Flujos principales"
Cohesion: 0.33
Nodes (6): Factura por WhatsApp, Flujos principales, Guardar un movimiento, Ingreso y desbloqueo, Recordatorios y Web Push, Sincronización y modo sin conexión

### Community 130 - "Variables de entorno"
Cohesion: 0.33
Nodes (6): Base, Correo, Facturas por WhatsApp, OCR e IA, Notificaciones push, Operación interna, Variables de entorno

## Knowledge Gaps
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `src/receipts/receipts.service.ts` to `app.module.ts`, `base64.ts`, `deposits.ts`, `.require`, `backend/package.json`, `members.ts`, `accounts.schemas.ts`, `recurring.schemas.ts`, `test/helpers.ts`, `rates.controller.ts`, `toBase64`, `PrismaService`, `auth.controller.ts`, `account.controller.ts`, `Env`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `SavingsService` be split into smaller, more focused modules?**
  _Cohesion score 0.083710407239819 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `KeyVaultService`, `articles.ts`, `parseDecimalInput`, `progress.service.ts`, `dependencies`, `registration.service.ts`, `debts-page.ts`, `core/auth/auth.service.ts`, `debit-card-page.ts`, `savings-page.ts`, `rates-page.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `frontend` be split into smaller, more focused modules?**
  _Cohesion score 0.046464646464646465 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `base64.ts`, `app.module.ts`, `deposits.ts`, `members.ts`, `health.controller.ts`, `RemindersService`, `test/helpers.ts`, `toBase64`, `src/receipts/receipts.service.ts`, `auth.controller.ts`, `Env`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `members.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.030621785881252923 - nodes in this community are weakly interconnected._