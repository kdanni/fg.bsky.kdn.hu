DROP PROCEDURE IF EXISTS sp_UPDATE_has_image_4h;

CREATE PROCEDURE sp_UPDATE_has_image_4h ()
BEGIN

    DECLARE done INT DEFAULT FALSE;
    DECLARE v_url VARCHAR(200);
    DECLARE v_has_image VARCHAR(64);
    DECLARE cur CURSOR FOR
        SELECT p.url, p.has_image
        FROM bsky_post p
        WHERE p.updated_at > now() - INTERVAL 4 HOUR;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP

        FETCH cur INTO v_url, v_has_image;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Update the feed_post table with the new has_image value
        UPDATE feed_post
        SET has_image = v_has_image
        WHERE url = v_url;

    END LOOP;

    CLOSE cur;

END