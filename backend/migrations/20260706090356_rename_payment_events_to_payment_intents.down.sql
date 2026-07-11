ALTER TABLE payment_intents
RENAME TO payment_events;


ALTER INDEX payment_intents_pkey
RENAME TO payment_events_pkey;

ALTER INDEX payment_intents_provider_event_id_key
RENAME TO payment_events_provider_event_id_key;

ALTER INDEX idx_payment_intents_processed
RENAME TO idx_payment_events_processed;

ALTER INDEX idx_payment_intents_idempotency
RENAME TO idx_payment_events_idempotency;