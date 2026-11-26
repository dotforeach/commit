-- Preferencia de tipo de cambio del dólar por hogar (oficial, mep, blue, ccl…).
ALTER TABLE "households" ADD COLUMN "usdRateType" VARCHAR(20) NOT NULL DEFAULT 'mep';
