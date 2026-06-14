ALTER TABLE payment_events
ADD COLUMN user_id UUID
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE payment_events
ADD COLUMN plan TEXT;

ALTER TABLE payment_events
ADD COLUMN idempotency_key TEXT;

CREATE UNIQUE INDEX
idx_payment_events_idempotency
ON payment_events(idempotency_key);