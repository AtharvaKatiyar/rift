ALTER TABLE payment_webhooks
ADD COLUMN processing_started_at TIMESTAMPTZ;

ALTER TABLE payment_webhooks
ADD COLUMN next_retry_at TIMESTAMPTZ;

CREATE INDEX idx_payment_webhooks_next_retry_at
ON payment_webhooks(next_retry_at)
WHERE processing_status = 'failed';

CREATE INDEX idx_payment_webhooks_processing_started_at
ON payment_webhooks(processing_started_at)
WHERE processing_status = 'processing';