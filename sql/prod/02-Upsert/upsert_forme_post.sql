
DROP PROCEDURE IF EXISTS sp_UPSERT_forme_post;

CREATE PROCEDURE sp_UPSERT_forme_post (
  url VARCHAR(200),
  has_image VARCHAR(64),
  sfw INT,
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  INSERT INTO forme_post (
    url,
    has_image,
    sfw,
    posted_at
  ) VALUES (
    url,
    has_image,
    sfw,
    posted_at
  )
  ON DUPLICATE KEY UPDATE  
    posted_at = posted_at,
    has_image = has_image,
    sfw = sfw,
    updated_at = @at_now;

END