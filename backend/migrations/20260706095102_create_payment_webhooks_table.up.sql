CREATE TYPE payment_provider AS ENUM (
    'dodo'
);

CREATE TYPE webhook_processing_status AS ENUM (
    'pending',
    'processing',
    'processed',
    'failed'
);

CREATE TABLE payment_webhooks (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    provider payment_provider
        NOT NULL,

    provider_event_id TEXT
        NOT NULL
        CHECK (
            length(trim(provider_event_id)) > 0
        ),

    event_type TEXT
        NOT NULL
        CHECK (
            length(trim(event_type)) > 0
        ),

    headers JSONB
        NOT NULL,

    payload JSONB
        NOT NULL,

    processing_status
        webhook_processing_status
        NOT NULL
        DEFAULT 'pending',

    processing_attempts INTEGER
        NOT NULL
        DEFAULT 0
        CHECK (
            processing_attempts >= 0
        ),

    last_error TEXT,

    received_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

    processed_at TIMESTAMPTZ,

    CONSTRAINT
        payment_webhooks_provider_event_unique
        UNIQUE (
            provider,
            provider_event_id
        )
);

CREATE INDEX
    idx_payment_webhooks_status_received_at
ON payment_webhooks (
    processing_status,
    received_at
);