-- Remove redundant indexes

DROP INDEX IF EXISTS
    idx_user_subscriptions_user_id;

DROP INDEX IF EXISTS
    idx_payment_events_provider_event;


-- Add missing indexes

CREATE UNIQUE INDEX
    idx_refresh_tokens_token_hash
ON refresh_tokens(token_hash);

CREATE INDEX
    idx_link_history_link
ON link_history(link_id);