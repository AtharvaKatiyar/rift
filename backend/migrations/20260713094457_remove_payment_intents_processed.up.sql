DROP INDEX IF EXISTS
    idx_payment_intents_processed;

ALTER TABLE payment_intents
DROP COLUMN processed;