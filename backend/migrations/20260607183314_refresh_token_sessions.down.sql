ALTER TABLE refresh_tokens
DROP COLUMN IF EXISTS ip_address,

DROP COLUMN IF EXISTS user_agent,

DROP COLUMN IF EXISTS replaced_by_token,

DROP COLUMN IF EXISTS revoked_at;