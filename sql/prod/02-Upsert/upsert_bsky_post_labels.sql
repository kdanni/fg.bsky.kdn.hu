DROP PROCEDURE IF EXISTS sp_UPSERT_bsky_post_labels;

CREATE PROCEDURE sp_UPSERT_bsky_post_labels (
  url VARCHAR(255),
  author_did VARCHAR(255),
  text TEXT,
  langs VARCHAR(27),
  has_image VARCHAR(64),
  labels JSON,
  custom_labels JSON,
  nsfw INT,
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  -- Replies wont be saved.
  INSERT INTO bsky_post_labels (
    url,
    author_did,
    text,
    langs,
    has_image,
    labels,
    custom_labels,
    nsfw,
    posted_at,
    created_at,
    updated_at
  ) VALUES (
    url,
    author_did,
    text,
    langs,
    has_image,
    labels,
    custom_labels,
    nsfw,
    posted_at,
    @at_now,
    @at_now
  )
  ON DUPLICATE KEY UPDATE  
    author_did = author_did,
    text = text,
    langs = langs,
    has_image = has_image,
    labels = labels,
    custom_labels = custom_labels,
    nsfw = nsfw,
    posted_at = posted_at,
    updated_at = @at_now;
  

END