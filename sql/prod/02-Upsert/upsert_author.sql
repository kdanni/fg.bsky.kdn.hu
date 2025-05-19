
DROP PROCEDURE IF EXISTS sp_UPSERT_bsky_author;

CREATE PROCEDURE sp_UPSERT_bsky_author (
  did VARCHAR(255),
  handle VARCHAR(255),
  displayName VARCHAR(255),
  avatar VARCHAR(255),
  data JSON
)
BEGIN
  SET @at_now = now();

  INSERT INTO bsky_author (
    did,
    handle,
    displayName,
    avatar,
    data
  ) VALUES (
    did,
    handle,
    displayName,
    avatar,
    data  
  )
  ON DUPLICATE KEY UPDATE  
    handle = handle,
    displayName = displayName,
    avatar = avatar,
    data = data,
    updated_at = @at_now;

END