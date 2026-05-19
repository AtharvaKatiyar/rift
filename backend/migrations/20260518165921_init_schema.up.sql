CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,

    password_hash TEXT,
    google_id TEXT UNIQUE,

    profile_picture TEXT,

    plan TEXT NOT NULL DEFAULT 'free',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT username_length
    CHECK (
        LENGTH(username) >= 3
        AND LENGTH(username) <= 20
    )
);

CREATE TABLE central_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,

    title TEXT NOT NULL,

    slug TEXT NOT NULL,

    unique_id TEXT UNIQUE NOT NULL,

    target_url TEXT NOT NULL,

    click_count BIGINT NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, slug),
    CONSTRAINT valid_target_url
    CHECK (
        target_url ~ '^https?://'
    )
);

CREATE TABLE link_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    link_id UUID NOT NULL
    REFERENCES central_links(id)
    ON DELETE CASCADE,

    old_target_url TEXT NOT NULL,
    new_target_url TEXT NOT NULL,

    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);