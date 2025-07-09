
DROP PROCEDURE IF EXISTS sp_UPSERT_bsky_post;

CREATE PROCEDURE sp_UPSERT_bsky_post (
  url VARCHAR(255),
  cid VARCHAR(255),
  author_did VARCHAR(255),
  reply_to_cid VARCHAR(255),
  text TEXT,
  facets JSON,
  embeds JSON,
  has_image VARCHAR(64),
  posted_at datetime
)
BEGIN
  SET @at_now = now();

  IF (reply_to_cid IS NULL OR reply_to_cid = '') THEN
    SET reply_to_cid = NULL;
  END IF;
  -- Replies wont be saved.
  IF (reply_to_cid IS NULL) THEN  
    INSERT INTO bsky_post (
      url,
      cid,
      author_did,
      reply_to_cid,
      text,
      facets,
      embeds,
      has_image,
      posted_at
    ) VALUES (
      url,
      cid,
      author_did,
      reply_to_cid,
      text,
      facets,
      embeds,
      has_image,
      posted_at
    )
    ON DUPLICATE KEY UPDATE  
      cid = cid,
      author_did = author_did,
      reply_to_cid = reply_to_cid,
      text = text,
      facets = facets,
      embeds = embeds,
      has_image = has_image,
      posted_at = posted_at,
      updated_at = @at_now;
  END IF;

END