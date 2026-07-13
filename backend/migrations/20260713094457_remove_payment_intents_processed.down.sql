ALTER TABLE payment_intents
ADD COLUMN processed BOOLEAN
    NOT NULL
    DEFAULT FALSE;

UPDATE payment_intents
SET processed = TRUE
WHERE status = 'succeeded';

CREATE INDEX idx_payment_intents_processed
ON payment_intents(processed);