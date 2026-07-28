CREATE TABLE email_verification_tokens (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    token_hash CHAR(64) NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT NOW()
);

CREATE INDEX idx_email_verification_user
ON email_verification_tokens(user_id);

CREATE INDEX idx_email_verification_expiry
ON email_verification_tokens(expires_at);