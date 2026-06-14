CREATE TYPE subscription_plan AS ENUM (
    'free',
    'starter',
    'pro'
);

CREATE TYPE subscription_status AS ENUM (
    'active',
    'inactive',
    'past_due',
    'cancelled',
    'expired'
);

CREATE TABLE user_subscriptions (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    plan subscription_plan
        NOT NULL
        DEFAULT 'free',

    status subscription_status
        NOT NULL
        DEFAULT 'active',

    provider_customer_id TEXT,

    provider_subscription_id TEXT,

    current_period_start TIMESTAMPTZ,

    current_period_end TIMESTAMPTZ,

    cancel_at_period_end BOOLEAN
        NOT NULL
        DEFAULT FALSE,

    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),

    UNIQUE(user_id)
);

CREATE INDEX idx_user_subscriptions_user_id
ON user_subscriptions(user_id);

CREATE INDEX idx_user_subscriptions_provider_customer
ON user_subscriptions(provider_customer_id);

CREATE INDEX idx_user_subscriptions_provider_subscription
ON user_subscriptions(provider_subscription_id);