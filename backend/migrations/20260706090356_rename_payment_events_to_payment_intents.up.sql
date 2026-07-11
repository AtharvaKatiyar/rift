ALTER TABLE payment_events
RENAME TO payment_intents;


ALTER INDEX payment_events_pkey
RENAME TO payment_intents_pkey;

ALTER INDEX payment_events_provider_event_id_key
RENAME TO payment_intents_provider_event_id_key;

ALTER INDEX idx_payment_events_processed
RENAME TO idx_payment_intents_processed;

ALTER INDEX idx_payment_events_idempotency
RENAME TO idx_payment_intents_idempotency;