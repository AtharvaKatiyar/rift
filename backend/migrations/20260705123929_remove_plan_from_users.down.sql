ALTER TABLE users
ADD COLUMN plan subscription_plan
NOT NULL
DEFAULT 'free';