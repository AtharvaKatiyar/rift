CREATE TYPE payment_intent_status AS ENUM (
    'pending',
    'succeeded',
    'failed',
    'cancelled',
    'expired'
);

ALTER TABLE payment_intents
ADD COLUMN status payment_intent_status
    NOT NULL
    DEFAULT 'pending';

UPDATE payment_intents
SET status = 'succeeded'
WHERE processed = TRUE;

CREATE INDEX idx_payment_intents_status
ON payment_intents(status);