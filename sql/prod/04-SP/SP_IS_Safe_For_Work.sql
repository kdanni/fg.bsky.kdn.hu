DROP PROCEDURE IF EXISTS SP_IS_Safe_For_Work;


CREATE PROCEDURE SP_IS_Safe_For_Work ( 
    p_url VARCHAR(200)
)
BEGIN

    DECLARE v_is_safe_for_work INT DEFAULT 1;

    SELECT CASE 
        WHEN list_name = 'NSFW' THEN 0
        ELSE 1
    END INTO v_is_safe_for_work
    FROM listed_post
    WHERE url = p_url;

    IF v_is_safe_for_work = 1 THEN

        SELECT CASE 
            WHEN nsfw = 1 THEN 0
            ELSE 1
        END INTO v_is_safe_for_work
        FROM bsky_post_labels
        WHERE url = p_url;

    END IF;

    SELECT v_is_safe_for_work AS is_safe_for_work;
END