
DROP PROCEDURE IF EXISTS SP_SELECT_followed_or_listed_feed_posts;

CREATE PROCEDURE SP_SELECT_followed_or_listed_feed_posts ( 
    cursor_date datetime,
    image_only boolean,
    p_limit INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT u.url, u.has_image, u.posted_at
    FROM (
        SELECT url, has_image, posted_at
        FROM listed_post
        UNION
        SELECT url, has_image, posted_at
        FROM followed_post
    ) u
    WHERE u.posted_at < cursor_date
    AND (u.has_image = 'image/' OR image_only = false OR image_only IS NULL)
    ORDER BY u.posted_at DESC
    LIMIT p_limit;

END