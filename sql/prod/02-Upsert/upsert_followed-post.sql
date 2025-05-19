
DROP PROCEDURE IF EXISTS sp_UPSERT_followed_post;

CREATE PROCEDURE sp_UPSERT_followed_post (
  url VARCHAR(200),
  has_image VARCHAR(64),
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  INSERT INTO followed_post (
    url,
    has_image,
    posted_at
  ) VALUES (
    url,
    has_image,
    posted_at
  )
  ON DUPLICATE KEY UPDATE  
    posted_at = posted_at,
    has_image = has_image,
    updated_at = @at_now;

END