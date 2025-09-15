
DROP PROCEDURE IF EXISTS SP_SELECT_followed_or_listed_feed_posts_PET;

CREATE PROCEDURE SP_SELECT_followed_or_listed_feed_posts_PET ( 
    cursor_date datetime,
    p_limit INT,
    p_sfw INT,
    p_actor VARCHAR(200)
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;
    
    if p_sfw is null or p_sfw < 0 then
        set p_sfw = 10;
    end if;

    -- if p_actor is null then
    --     set p_actor = 'FEEDGEN_PUBLISHER';
    -- end if;

    SELECT u.url, u.has_image, u.posted_at
    FROM (
        SELECT url, has_image, posted_at
        FROM listed_post
        WHERE has_image LIKE '%::PET%'
        UNION
        SELECT url, has_image, posted_at
        FROM followed_post
        WHERE has_image LIKE '%::PET%'
    ) u
    WHERE u.posted_at < cursor_date
        AND u.has_image LIKE '%::PET%'
    -- AND (u.has_image = 'image/' OR image_only = false OR image_only IS NULL)
    ORDER BY u.posted_at DESC
    LIMIT p_limit;

END