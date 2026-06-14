DROP INDEX IF EXISTS
idx_payment_events_idempotency;

ALTER TABLE payment_events
DROP COLUMN IF EXISTS
idempotency_key;

ALTER TABLE payment_events
DROP COLUMN IF EXISTS
plan;

ALTER TABLE payment_events
DROP COLUMN IF EXISTS
user_id;