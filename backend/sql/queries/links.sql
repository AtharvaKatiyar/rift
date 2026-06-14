-- name: CreateLink :one
INSERT INTO central_links (
    user_id,
    title,
    slug,
    unique_id,
    target_url
)
VALUES (
    $1, $2, $3, $4, $5
)
RETURNING *;


-- name: GetUserLinks :many
SELECT *
FROM central_links
WHERE user_id = $1
AND is_deleted = FALSE
ORDER BY created_at DESC
LIMIT $2
OFFSET $3;

-- name: GetLinkByID :one
SELECT *
FROM central_links
WHERE id = $1;

-- name: GetLinkBySlug :one
SELECT *
FROM central_links
WHERE user_id = $1
AND slug = $2;


-- name: UpdateLink :one
UPDATE central_links
SET
    title = $3,
    slug = $4,
    target_url = $5,
    updated_at = NOW()
WHERE id = $1
AND user_id = $2
RETURNING *;


-- name: DeleteLink :exec
UPDATE central_links
SET
	is_deleted = TRUE,
	deleted_at = NOW()
WHERE id = $1
AND user_id = $2;

-- name: CountUserLinks :one
SELECT COUNT(*)
FROM central_links
WHERE user_id = $1
AND is_deleted = FALSE;

-- name: GetLinkByPublicKey :one
SELECT *
FROM central_links
WHERE unique_id = $1;

-- name: GetLinkForRedirect :one
SELECT
    cl.*,
    u.username
FROM central_links cl
JOIN users u
ON cl.user_id = u.id
WHERE cl.unique_id = $1
AND cl.is_deleted = FALSE
AND cl.is_active = TRUE;


-- name: IncrementClickCount :exec
UPDATE central_links
SET click_count = click_count + 1
WHERE id = $1;

-- name: GetLinkByIDAndUserID :one
SELECT *
FROM central_links
WHERE id = $1
AND user_id = $2
AND is_deleted = FALSE;

-- name: CreateLinkHistory :exec
INSERT INTO link_history (
    link_id,
    old_target_url,
    new_target_url
)
VALUES (
    $1, $2, $3
);

-- name: ToggleLinkStatus :one
UPDATE central_links
SET
    is_active = $3,
    updated_at = NOW()
WHERE id = $1
AND user_id = $2
RETURNING *;

-- name: IncrementClickCountBy :exec
UPDATE central_links
SET click_count =
	click_count + sqlc.arg(increment_by)
WHERE id =
	sqlc.arg(id);