
DROP PROCEDURE IF EXISTS SP_SELECT_bsky_posts;

CREATE PROCEDURE SP_SELECT_bsky_posts ( 
    cursor_date datetime,
    p_limit INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT *
    FROM bsky_post
    WHERE posted_at > cursor_date
    ORDER BY posted_at ASC
    LIMIT p_limit;

END