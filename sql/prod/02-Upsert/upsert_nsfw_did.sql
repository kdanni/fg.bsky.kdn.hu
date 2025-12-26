
DROP PROCEDURE IF EXISTS sp_UPSERT_nsfw_did;

CREATE PROCEDURE sp_UPSERT_nsfw_did (
  did VARCHAR(255),
  active INT
)
BEGIN
  SET @at_now = now();

  INSERT INTO nsfw_did (
    did,
    active
  ) VALUES (
    did,
    active
  )
  ON DUPLICATE KEY UPDATE  
    active = active,
    updated_at = @at_now;

END