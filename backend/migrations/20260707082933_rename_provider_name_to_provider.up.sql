ALTER TABLE payment_intents
RENAME COLUMN provider_name
TO provider;

ALTER TABLE payment_intents
ALTER COLUMN provider
TYPE payment_provider
USING provider::payment_provider;