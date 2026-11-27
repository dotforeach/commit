-- CreateEnum
CREATE TYPE "ReceiptEventStatus" AS ENUM ('PROCESSED', 'FAILED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED');

-- CreateTable
CREATE TABLE "whatsapp_links" (
    "userId" UUID NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "consentAt" TIMESTAMPTZ NOT NULL,
    "linkedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_links_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "receipt_inbox" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sealed" BYTEA NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_events" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "ReceiptEventStatus" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "userId" UUID NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodEnd" TIMESTAMPTZ NOT NULL,
    "provider" TEXT,
    "providerRef" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_links_phoneHash_key" ON "whatsapp_links"("phoneHash");

-- CreateIndex
CREATE INDEX "receipt_inbox_userId_createdAt_idx" ON "receipt_inbox"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "receipt_events_userId_createdAt_idx" ON "receipt_events"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "whatsapp_links" ADD CONSTRAINT "whatsapp_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_inbox" ADD CONSTRAINT "receipt_inbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_events" ADD CONSTRAINT "receipt_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
