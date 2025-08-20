
DROP PROCEDURE IF EXISTS sp_UPSERT_feed_post;

CREATE PROCEDURE sp_UPSERT_feed_post (
  feed_name VARCHAR(54),
  url VARCHAR(200),
  sfw INT,
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  -- SET @has_image = (SELECT has_image FROM bsky_post WHERE url = url);

  INSERT INTO feed_post (
    feed_name,
    url,
    sfw,
    -- has_image,
    posted_at
  ) VALUES (
    feed_name,
    url,
    sfw,
    -- @has_image,
    posted_at
  )
  ON DUPLICATE KEY UPDATE
    sfw = sfw,
    -- has_image = @has_image,
    posted_at = posted_at,
    updated_at = @at_now;

END