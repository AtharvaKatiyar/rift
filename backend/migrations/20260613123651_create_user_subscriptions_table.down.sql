DROP INDEX IF EXISTS
    idx_user_subscriptions_provider_subscription;

DROP INDEX IF EXISTS
    idx_user_subscriptions_provider_customer;

DROP INDEX IF EXISTS
    idx_user_subscriptions_user_id;

DROP TABLE IF EXISTS
    user_subscriptions;

DROP TYPE IF EXISTS
    subscription_status;

DROP TYPE IF EXISTS
    subscription_plan;