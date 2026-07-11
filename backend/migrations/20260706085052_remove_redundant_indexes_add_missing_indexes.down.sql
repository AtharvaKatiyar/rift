-- Remove newly added indexes

DROP INDEX IF EXISTS
    idx_link_history_link;

DROP INDEX IF EXISTS
    idx_refresh_tokens_token_hash;


-- Restore removed indexes

CREATE INDEX
    idx_user_subscriptions_user_id
ON user_subscriptions(user_id);

CREATE INDEX
    idx_payment_events_provider_event
ON payment_events(provider_event_id);