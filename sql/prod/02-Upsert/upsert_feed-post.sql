
DROP PROCEDURE IF EXISTS sp_UPSERT_feed_post;

CREATE PROCEDURE sp_UPSERT_feed_post (
  feed_name VARCHAR(54),
  url VARCHAR(200),
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  INSERT INTO feed_post (
    feed_name,
    url,
    posted_at
  ) VALUES (
    feed_name,
    url,
    posted_at
  )
  ON DUPLICATE KEY UPDATE  
    posted_at = posted_at,
    updated_at = @at_now;

END