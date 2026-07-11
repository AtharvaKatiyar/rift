DROP INDEX IF EXISTS
    idx_payment_webhooks_status_received_at;

DROP TABLE IF EXISTS
    payment_webhooks;

DROP TYPE IF EXISTS
    webhook_processing_status;

DROP TYPE IF EXISTS
    payment_provider;