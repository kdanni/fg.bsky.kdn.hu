
DROP PROCEDURE IF EXISTS SP_SELECT_listed_feed_posts;

CREATE PROCEDURE SP_SELECT_listed_feed_posts ( 
    cursor_date datetime,
    image_only boolean,
    p_limit INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT *
    FROM listed_post
    WHERE posted_at < cursor_date AND list_name <> 'NSFW' AND list_name <> 'Not Listed'
    AND (has_image = 'image/' OR image_only = false OR image_only IS NULL)
    ORDER BY posted_at DESC
    LIMIT p_limit;

END