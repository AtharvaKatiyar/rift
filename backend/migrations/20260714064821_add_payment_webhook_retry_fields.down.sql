DROP INDEX IF EXISTS
    idx_payment_webhooks_processing_started_at;

DROP INDEX IF EXISTS
    idx_payment_webhooks_next_retry_at;

ALTER TABLE payment_webhooks
DROP COLUMN IF EXISTS next_retry_at;

ALTER TABLE payment_webhooks
DROP COLUMN IF EXISTS processing_started_at;