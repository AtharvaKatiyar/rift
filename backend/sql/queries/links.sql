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
ORDER BY created_at DESC;


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
    title = $2,
    slug = $3,
    target_url = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;


-- name: DeleteLink :exec
DELETE FROM central_links
WHERE id = $1;


-- name: CountUserLinks :one
SELECT COUNT(*)
FROM central_links
WHERE user_id = $1;