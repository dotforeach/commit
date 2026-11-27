-- Panamá como mercado principal: "$" queda solo para el dólar y se suman monedas de la región.
UPDATE "currencies" SET "symbol" = '$' WHERE "code" = 'USD';
UPDATE "currencies" SET "symbol" = 'AR$' WHERE "code" = 'ARS';
UPDATE "currencies" SET "symbol" = 'CL$' WHERE "code" = 'CLP';
UPDATE "currencies" SET "symbol" = 'COL$' WHERE "code" = 'COP';
UPDATE "currencies" SET "symbol" = 'MX$' WHERE "code" = 'MXN';

INSERT INTO "currencies" ("code", "name", "symbol", "decimals", "isCrypto") VALUES
  ('PAB', 'Balboa panameño', 'B/.', 2, false),
  ('CRC', 'Colón costarricense', '₡', 2, false),
  ('GTQ', 'Quetzal guatemalteco', 'Q', 2, false),
  ('DOP', 'Peso dominicano', 'RD$', 2, false),
  ('HNL', 'Lempira hondureño', 'L', 2, false),
  ('NIO', 'Córdoba nicaragüense', 'C$', 2, false),
  ('GBP', 'Libra esterlina', '£', 2, false),
  ('CAD', 'Dólar canadiense', 'CA$', 2, false),
  ('CNY', 'Yuan chino', 'CN¥', 2, false),
  ('JPY', 'Yen japonés', '¥', 0, false),
  ('CHF', 'Franco suizo', 'CHF', 2, false)
ON CONFLICT ("code") DO NOTHING;

-- Idioma por defecto de las cuentas nuevas: español de Panamá.
ALTER TABLE "users" ALTER COLUMN "locale" SET DEFAULT 'es-PA';
