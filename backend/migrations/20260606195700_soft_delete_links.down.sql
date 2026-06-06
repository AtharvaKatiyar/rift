ALTER TABLE central_links
DROP COLUMN IF EXISTS is_deleted;

ALTER TABLE central_links
DROP COLUMN IF EXISTS deleted_at;