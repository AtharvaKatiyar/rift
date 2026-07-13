DROP INDEX IF EXISTS
    idx_payment_intents_status;

ALTER TABLE payment_intents
DROP COLUMN IF EXISTS status;

DROP TYPE IF EXISTS
    payment_intent_status;