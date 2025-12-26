
DROP PROCEDURE IF EXISTS sp_UPSERT_nsfw_handle;

CREATE PROCEDURE sp_UPSERT_nsfw_handle (
  handle VARCHAR(255),
  active INT
)
BEGIN
  SET @at_now = now();

  INSERT INTO nsfw_handle (
    handle,
    active
  ) VALUES (
    handle,
    active
  )
  ON DUPLICATE KEY UPDATE  
    active = active,
    updated_at = @at_now;

END