
DROP PROCEDURE IF EXISTS sp_UPSERT_listed_post;

CREATE PROCEDURE sp_UPSERT_listed_post (
  url VARCHAR(200),
  list_name VARCHAR(54),
  has_image VARCHAR(64),
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  INSERT INTO listed_post (
    url,
    list_name,
    has_image,
    posted_at
  ) VALUES (
    url,
    list_name,
    has_image,
    posted_at
  )
  ON DUPLICATE KEY UPDATE  
    list_name = list_name,
    has_image = has_image,
    posted_at = posted_at,
    updated_at = @at_now;

END