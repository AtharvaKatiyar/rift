ALTER TABLE payment_events
ALTER COLUMN plan
TYPE subscription_plan
USING plan::subscription_plan;