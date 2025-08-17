DROP PROCEDURE IF EXISTS upsert_favorites_post;

CREATE PROCEDURE upsert_favorites_post (
  IN p_url VARCHAR(200),
  IN p_has_image VARCHAR(64),
  IN p_sfw INT,
  IN p_actor VARCHAR(200),
  IN p_posted_at datetime
)
BEGIN
  INSERT INTO favorites_post (url, has_image, sfw, actor, posted_at)
  VALUES (p_url, p_has_image, p_sfw, p_actor, p_posted_at)
  ON DUPLICATE KEY UPDATE
    has_image = p_has_image,
    sfw = p_sfw,
    actor = p_actor,
    posted_at = p_posted_at,
    updated_at = CURRENT_TIMESTAMP;
END;