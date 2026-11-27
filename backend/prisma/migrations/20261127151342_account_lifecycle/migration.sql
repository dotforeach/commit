-- CreateEnum
CREATE TYPE "AccountTokenType" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD', 'CHANGE_EMAIL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ALTER COLUMN "timezone" SET DEFAULT 'America/Panama';

-- CreateTable
CREATE TABLE "account_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "AccountTokenType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "newEmail" CITEXT,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "usedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "known_devices" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "deviceHash" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "known_devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_tokens_tokenHash_key" ON "account_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "account_tokens_userId_type_idx" ON "account_tokens"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "known_devices_userId_deviceHash_key" ON "known_devices"("userId", "deviceHash");

-- AddForeignKey
ALTER TABLE "account_tokens" ADD CONSTRAINT "account_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "known_devices" ADD CONSTRAINT "known_devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
