CREATE TABLE payment_events (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    provider_event_id TEXT
        NOT NULL
        UNIQUE,

    provider_name TEXT
        NOT NULL,

    event_type TEXT
        NOT NULL,

    processed BOOLEAN
        NOT NULL
        DEFAULT FALSE,

    payload JSONB,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW()
);

CREATE INDEX idx_payment_events_provider_event
ON payment_events(provider_event_id);

CREATE INDEX idx_payment_events_processed
ON payment_events(processed);