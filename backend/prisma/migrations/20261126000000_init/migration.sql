-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateEnum
CREATE TYPE "HouseholdRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING_KEY', 'ACTIVE');

-- CreateEnum
CREATE TYPE "AssetClass" AS ENUM ('STOCK', 'CEDEAR', 'BOND', 'ETF', 'MUTUAL_FUND', 'CRYPTO', 'STABLECOIN', 'REAL_ESTATE', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CASH', 'CHECKING', 'SAVINGS', 'DIGITAL_WALLET', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "StatementStatus" AS ENUM ('OPEN', 'CLOSED', 'PARTIALLY_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "CategoryKind" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "BudgetGroup" AS ENUM ('NEEDS', 'WANTS', 'SAVINGS');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CLEARED');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "BudgetMethod" AS ENUM ('CATEGORY', 'FIFTY_THIRTY_TWENTY', 'ENVELOPE');

-- CreateEnum
CREATE TYPE "DebtKind" AS ENUM ('PERSONAL_LOAN', 'MORTGAGE', 'CAR_LOAN', 'CREDIT_CARD_BALANCE', 'FAMILY_OR_FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestRateType" AS ENUM ('FIXED', 'VARIABLE', 'INDEXED', 'NONE');

-- CreateEnum
CREATE TYPE "AmortizationSystem" AS ENUM ('FRENCH', 'GERMAN', 'BULLET', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('ACTIVE', 'PAID_OFF', 'DEFAULTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GoalKind" AS ENUM ('EMERGENCY_FUND', 'SAVINGS_GOAL', 'RETIREMENT');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'ACHIEVED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvestmentTxType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'FEE', 'SPLIT');

-- CreateEnum
CREATE TYPE "DepositStatus" AS ENUM ('ACTIVE', 'MATURED', 'RENEWED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REMINDER', 'LOCAL_ALERT', 'HOUSEHOLD_INVITATION', 'MEMBER_PENDING_KEY', 'SECURITY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" CITEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'es-AR',
    "timezone" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
    "defaultHouseholdId" UUID,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "onboardingCompletedAt" TIMESTAMPTZ,
    "emailVerifiedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_keys" (
    "userId" UUID NOT NULL,
    "keyVersion" INTEGER NOT NULL DEFAULT 1,
    "publicKey" BYTEA NOT NULL,
    "signingPublicKey" BYTEA NOT NULL,
    "encryptedPrivateKeys" BYTEA NOT NULL,
    "kdfSalt" BYTEA NOT NULL,
    "kdfParams" JSONB NOT NULL,
    "recoveryEncryptedKeys" BYTEA NOT NULL,
    "recoveryKdfSalt" BYTEA NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_keys_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "households" (
    "id" UUID NOT NULL,
    "baseCurrency" VARCHAR(10) NOT NULL,
    "isPersonal" BOOLEAN NOT NULL DEFAULT false,
    "currentKeyVersion" INTEGER NOT NULL DEFAULT 1,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "household_keys" (
    "householdId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_keys_pkey" PRIMARY KEY ("householdId","version")
);

-- CreateTable
CREATE TABLE "household_member_keys" (
    "householdId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "userKeyVersion" INTEGER NOT NULL,
    "wrappedKey" BYTEA NOT NULL,
    "signature" BYTEA NOT NULL,
    "wrappedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_member_keys_pkey" PRIMARY KEY ("householdId","version","userId")
);

-- CreateTable
CREATE TABLE "household_members" (
    "householdId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "HouseholdRole" NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING_KEY',
    "joinedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_members_pkey" PRIMARY KEY ("householdId","userId")
);

-- CreateTable
CREATE TABLE "household_invitations" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "email" CITEXT NOT NULL,
    "role" "HouseholdRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "invitedById" UUID NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "acceptedAt" TIMESTAMPTZ,
    "revokedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "household_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "code" VARCHAR(10) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 2,
    "isCrypto" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" UUID NOT NULL,
    "base" VARCHAR(10) NOT NULL,
    "quote" VARCHAR(10) NOT NULL,
    "rateType" TEXT NOT NULL DEFAULT 'official',
    "rate" DECIMAL(24,10) NOT NULL,
    "date" DATE NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "householdId" UUID,
    "assetClass" "AssetClass" NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "symbol" TEXT,
    "name" TEXT,
    "market" TEXT,
    "priceProviderKey" TEXT,
    "payload" BYTEA,
    "keyVersion" INTEGER,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_prices" (
    "assetId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "price" DECIMAL(24,10) NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "asset_prices_pkey" PRIMARY KEY ("assetId","date","provider")
);

-- CreateTable
CREATE TABLE "household_exchange_rates" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "base" VARCHAR(10) NOT NULL,
    "quote" VARCHAR(10) NOT NULL,
    "rateType" TEXT NOT NULL DEFAULT 'official',
    "date" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "household_exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_asset_prices" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "manual_asset_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "ownerUserId" UUID,
    "type" "AccountType" NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "archivedAt" TIMESTAMPTZ,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_cards" (
    "accountId" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "closingDay" INTEGER NOT NULL,
    "dueDay" INTEGER NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "credit_cards_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "credit_card_statements" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "creditCardId" UUID NOT NULL,
    "periodStart" DATE NOT NULL,
    "closingDate" DATE NOT NULL,
    "dueDate" DATE NOT NULL,
    "status" "StatementStatus" NOT NULL DEFAULT 'OPEN',
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "credit_card_statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "parentId" UUID,
    "kind" "CategoryKind" NOT NULL,
    "budgetGroup" "BudgetGroup",
    "systemKey" TEXT,
    "archivedAt" TIMESTAMPTZ,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "categoryId" UUID,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'CLEARED',
    "date" DATE NOT NULL,
    "transferGroupId" UUID,
    "recurringRuleId" UUID,
    "createdById" UUID NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_splits" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "settledAt" TIMESTAMPTZ,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "transaction_splits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_rules" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "categoryId" UUID,
    "type" "TransactionType" NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "dayOfMonth" INTEGER,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "nextRunOn" DATE NOT NULL,
    "autoPost" BOOLEAN NOT NULL DEFAULT false,
    "isSalary" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "recurring_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "method" "BudgetMethod" NOT NULL DEFAULT 'CATEGORY',
    "currency" VARCHAR(10) NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_items" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "budgetId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "rollover" BOOLEAN NOT NULL DEFAULT false,
    "alertThreshold" INTEGER NOT NULL DEFAULT 80,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "budget_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debts" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "accountId" UUID,
    "kind" "DebtKind" NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "rateType" "InterestRateType" NOT NULL DEFAULT 'FIXED',
    "amortization" "AmortizationSystem" NOT NULL DEFAULT 'FRENCH',
    "termMonths" INTEGER,
    "startDate" DATE NOT NULL,
    "paymentDay" INTEGER,
    "status" "DebtStatus" NOT NULL DEFAULT 'ACTIVE',
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debt_payments" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "debtId" UUID NOT NULL,
    "transactionId" UUID,
    "date" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "debt_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installment_plans" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "creditCardId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "installmentsCount" INTEGER NOT NULL,
    "interestFree" BOOLEAN NOT NULL DEFAULT true,
    "firstStatementOn" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "installment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_installments" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "dueMonth" DATE NOT NULL,
    "statementId" UUID,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "card_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_goals" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "accountId" UUID,
    "kind" "GoalKind" NOT NULL DEFAULT 'SAVINGS_GOAL',
    "currency" VARCHAR(10) NOT NULL,
    "targetDate" DATE,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "savings_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_contributions" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "goalId" UUID NOT NULL,
    "transactionId" UUID,
    "date" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "goal_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_transactions" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "cashTransactionId" UUID,
    "type" "InvestmentTxType" NOT NULL,
    "date" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "investment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_term_deposits" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "rateType" "InterestRateType" NOT NULL DEFAULT 'FIXED',
    "startDate" DATE NOT NULL,
    "maturityDate" DATE NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "status" "DepositStatus" NOT NULL DEFAULT 'ACTIVE',
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "fixed_term_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_health_scores" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "financial_health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_completions" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "completedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "milestone_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "net_worth_snapshots" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "net_worth_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tip_dismissals" (
    "userId" UUID NOT NULL,
    "tipKey" TEXT NOT NULL,
    "dismissedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tip_dismissals_pkey" PRIMARY KEY ("userId","tipKey")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" UUID NOT NULL,
    "householdId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "sourceId" UUID,
    "remindAt" TIMESTAMPTZ NOT NULL,
    "firedAt" TIMESTAMPTZ,
    "payload" BYTEA NOT NULL,
    "keyVersion" INTEGER NOT NULL,
    "revision" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "householdId" UUID,
    "reminderId" UUID,
    "type" "NotificationType" NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "payload" BYTEA,
    "keyVersion" INTEGER,
    "dedupeKey" TEXT,
    "readAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "household_member_keys_userId_idx" ON "household_member_keys"("userId");

-- CreateIndex
CREATE INDEX "household_members_userId_idx" ON "household_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "household_invitations_tokenHash_key" ON "household_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "household_invitations_householdId_idx" ON "household_invitations"("householdId");

-- CreateIndex
CREATE INDEX "household_invitations_email_idx" ON "household_invitations"("email");

-- CreateIndex
CREATE INDEX "exchange_rates_base_quote_date_idx" ON "exchange_rates"("base", "quote", "date");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_base_quote_rateType_date_provider_key" ON "exchange_rates"("base", "quote", "rateType", "date", "provider");

-- CreateIndex
CREATE INDEX "assets_householdId_revision_idx" ON "assets"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "assets_symbol_market_key" ON "assets"("symbol", "market");

-- CreateIndex
CREATE INDEX "household_exchange_rates_householdId_revision_idx" ON "household_exchange_rates"("householdId", "revision");

-- CreateIndex
CREATE INDEX "manual_asset_prices_householdId_revision_idx" ON "manual_asset_prices"("householdId", "revision");

-- CreateIndex
CREATE INDEX "accounts_householdId_revision_idx" ON "accounts"("householdId", "revision");

-- CreateIndex
CREATE INDEX "credit_cards_householdId_revision_idx" ON "credit_cards"("householdId", "revision");

-- CreateIndex
CREATE INDEX "credit_card_statements_householdId_revision_idx" ON "credit_card_statements"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "credit_card_statements_creditCardId_closingDate_key" ON "credit_card_statements"("creditCardId", "closingDate");

-- CreateIndex
CREATE INDEX "categories_householdId_revision_idx" ON "categories"("householdId", "revision");

-- CreateIndex
CREATE INDEX "transactions_householdId_revision_idx" ON "transactions"("householdId", "revision");

-- CreateIndex
CREATE INDEX "transactions_householdId_date_idx" ON "transactions"("householdId", "date" DESC);

-- CreateIndex
CREATE INDEX "transactions_accountId_date_idx" ON "transactions"("accountId", "date");

-- CreateIndex
CREATE INDEX "transactions_transferGroupId_idx" ON "transactions"("transferGroupId");

-- CreateIndex
CREATE INDEX "transaction_splits_householdId_revision_idx" ON "transaction_splits"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_splits_transactionId_userId_key" ON "transaction_splits"("transactionId", "userId");

-- CreateIndex
CREATE INDEX "recurring_rules_householdId_revision_idx" ON "recurring_rules"("householdId", "revision");

-- CreateIndex
CREATE INDEX "budgets_householdId_revision_idx" ON "budgets"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_householdId_year_month_key" ON "budgets"("householdId", "year", "month");

-- CreateIndex
CREATE INDEX "budget_items_householdId_revision_idx" ON "budget_items"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "budget_items_budgetId_categoryId_key" ON "budget_items"("budgetId", "categoryId");

-- CreateIndex
CREATE INDEX "debts_householdId_revision_idx" ON "debts"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "debt_payments_transactionId_key" ON "debt_payments"("transactionId");

-- CreateIndex
CREATE INDEX "debt_payments_householdId_revision_idx" ON "debt_payments"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "installment_plans_transactionId_key" ON "installment_plans"("transactionId");

-- CreateIndex
CREATE INDEX "installment_plans_householdId_revision_idx" ON "installment_plans"("householdId", "revision");

-- CreateIndex
CREATE INDEX "card_installments_householdId_revision_idx" ON "card_installments"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "card_installments_planId_number_key" ON "card_installments"("planId", "number");

-- CreateIndex
CREATE INDEX "savings_goals_householdId_revision_idx" ON "savings_goals"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "goal_contributions_transactionId_key" ON "goal_contributions"("transactionId");

-- CreateIndex
CREATE INDEX "goal_contributions_householdId_revision_idx" ON "goal_contributions"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "investment_transactions_cashTransactionId_key" ON "investment_transactions"("cashTransactionId");

-- CreateIndex
CREATE INDEX "investment_transactions_householdId_revision_idx" ON "investment_transactions"("householdId", "revision");

-- CreateIndex
CREATE INDEX "fixed_term_deposits_householdId_revision_idx" ON "fixed_term_deposits"("householdId", "revision");

-- CreateIndex
CREATE INDEX "financial_health_scores_householdId_revision_idx" ON "financial_health_scores"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "financial_health_scores_householdId_date_key" ON "financial_health_scores"("householdId", "date");

-- CreateIndex
CREATE INDEX "milestone_completions_householdId_revision_idx" ON "milestone_completions"("householdId", "revision");

-- CreateIndex
CREATE INDEX "net_worth_snapshots_householdId_revision_idx" ON "net_worth_snapshots"("householdId", "revision");

-- CreateIndex
CREATE UNIQUE INDEX "net_worth_snapshots_householdId_date_key" ON "net_worth_snapshots"("householdId", "date");

-- CreateIndex
CREATE INDEX "reminders_firedAt_remindAt_idx" ON "reminders"("firedAt", "remindAt");

-- CreateIndex
CREATE INDEX "reminders_householdId_revision_idx" ON "reminders"("householdId", "revision");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_createdAt_idx" ON "notifications"("userId", "readAt", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "notifications_userId_dedupeKey_key" ON "notifications"("userId", "dedupeKey");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_defaultHouseholdId_fkey" FOREIGN KEY ("defaultHouseholdId") REFERENCES "households"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_keys" ADD CONSTRAINT "user_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "households" ADD CONSTRAINT "households_baseCurrency_fkey" FOREIGN KEY ("baseCurrency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_keys" ADD CONSTRAINT "household_keys_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_member_keys" ADD CONSTRAINT "household_member_keys_householdId_version_fkey" FOREIGN KEY ("householdId", "version") REFERENCES "household_keys"("householdId", "version") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_member_keys" ADD CONSTRAINT "household_member_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_member_keys" ADD CONSTRAINT "household_member_keys_wrappedById_fkey" FOREIGN KEY ("wrappedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_members" ADD CONSTRAINT "household_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_invitations" ADD CONSTRAINT "household_invitations_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_invitations" ADD CONSTRAINT "household_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_base_fkey" FOREIGN KEY ("base") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_quote_fkey" FOREIGN KEY ("quote") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_prices" ADD CONSTRAINT "asset_prices_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "household_exchange_rates" ADD CONSTRAINT "household_exchange_rates_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_asset_prices" ADD CONSTRAINT "manual_asset_prices_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_asset_prices" ADD CONSTRAINT "manual_asset_prices_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_cards" ADD CONSTRAINT "credit_cards_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_card_statements" ADD CONSTRAINT "credit_card_statements_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "credit_cards"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringRuleId_fkey" FOREIGN KEY ("recurringRuleId") REFERENCES "recurring_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_splits" ADD CONSTRAINT "transaction_splits_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_splits" ADD CONSTRAINT "transaction_splits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_rules" ADD CONSTRAINT "recurring_rules_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_rules" ADD CONSTRAINT "recurring_rules_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_rules" ADD CONSTRAINT "recurring_rules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "debts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plans" ADD CONSTRAINT "installment_plans_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plans" ADD CONSTRAINT "installment_plans_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "credit_cards"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installment_plans" ADD CONSTRAINT "installment_plans_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_installments" ADD CONSTRAINT "card_installments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "installment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_installments" ADD CONSTRAINT "card_installments_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "credit_card_statements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_goals" ADD CONSTRAINT "savings_goals_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_goals" ADD CONSTRAINT "savings_goals_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "savings_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_cashTransactionId_fkey" FOREIGN KEY ("cashTransactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_term_deposits" ADD CONSTRAINT "fixed_term_deposits_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_term_deposits" ADD CONSTRAINT "fixed_term_deposits_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_health_scores" ADD CONSTRAINT "financial_health_scores_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_completions" ADD CONSTRAINT "milestone_completions_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "net_worth_snapshots" ADD CONSTRAINT "net_worth_snapshots_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tip_dismissals" ADD CONSTRAINT "tip_dismissals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "reminders"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────
-- Sincronización offline: `revision` se asigna desde una secuencia global
-- en cada INSERT/UPDATE. El cliente pide "todo lo que cambió después de N".
-- Toda tabla nueva con columna `revision` necesita este trigger.
-- ─────────────────────────────────────────────────────────────
CREATE SEQUENCE "sync_revision_seq" AS BIGINT;

CREATE FUNCTION "set_sync_revision"() RETURNS trigger AS $$
BEGIN
  NEW."revision" := nextval('sync_revision_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'revision'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_sync_revision()',
      t || '_sync_revision', t
    );
  END LOOP;
END;
$$;
