-- Catálogo inicial de monedas (datos públicos).
INSERT INTO "currencies" ("code", "name", "symbol", "decimals", "isCrypto") VALUES
  ('ARS', 'Peso argentino', '$', 2, false),
  ('USD', 'Dólar estadounidense', 'US$', 2, false),
  ('EUR', 'Euro', '€', 2, false),
  ('UYU', 'Peso uruguayo', '$U', 2, false),
  ('BRL', 'Real brasileño', 'R$', 2, false),
  ('CLP', 'Peso chileno', '$', 0, false),
  ('PYG', 'Guaraní', '₲', 0, false),
  ('BOB', 'Boliviano', 'Bs', 2, false),
  ('PEN', 'Sol peruano', 'S/', 2, false),
  ('COP', 'Peso colombiano', '$', 2, false),
  ('MXN', 'Peso mexicano', '$', 2, false),
  ('USDT', 'Tether', '₮', 2, true),
  ('USDC', 'USD Coin', 'USDC', 2, true),
  ('BTC', 'Bitcoin', '₿', 8, true),
  ('ETH', 'Ether', 'Ξ', 8, true)
ON CONFLICT ("code") DO NOTHING;
