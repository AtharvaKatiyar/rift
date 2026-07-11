ALTER TABLE payment_intents
ALTER COLUMN provider
TYPE TEXT
USING provider::TEXT;

ALTER TABLE payment_intents
RENAME COLUMN provider
TO provider_name;

DROP TYPE IF EXISTS payment_provider;