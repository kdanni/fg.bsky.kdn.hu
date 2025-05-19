
DROP PROCEDURE IF EXISTS SP_SELECT_followd_feed_posts;

CREATE PROCEDURE SP_SELECT_followd_feed_posts ( 
    cursor_date datetime,
    image_only boolean,
    p_limit INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT *
    FROM followed_post
    WHERE posted_at < cursor_date
    AND (has_image = 'image/' OR has_image IS NULL)
    ORDER BY posted_at DESC
    LIMIT p_limit;

END