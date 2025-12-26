
DROP PROCEDURE IF EXISTS SP_is_SFW;

CREATE PROCEDURE SP_is_SFW (
  p_did VARCHAR(255),
  p_handle VARCHAR(255)
)
BEGIN
  SET @sfw = 10;

  -- Declare variables to hold the counts
  SET @did_nsfw = 0;
  SET @handle_nsfw = 0;

  SELECT COUNT(*) INTO @did_nsfw 
    FROM nsfw_did 
    WHERE did = p_did 
    LIMIT 1;

  SELECT COUNT(*) INTO @handle_nsfw 
    FROM nsfw_handle
    WHERE handle = p_handle 
    LIMIT 1;

  -- If both exist, set our result to 1
  IF @did_nsfw > 0 OR @handle_nsfw > 0 THEN
    SET @sfw = 0;
  END IF;

  SELECT @did_nsfw as did_nsfw , @handle_nsfw as handle_nsfw,  @sfw as sfw;

END
