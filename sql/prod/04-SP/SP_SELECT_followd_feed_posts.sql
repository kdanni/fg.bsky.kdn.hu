
DROP PROCEDURE IF EXISTS SP_SELECT_followd_feed_posts;

CREATE PROCEDURE SP_SELECT_followd_feed_posts ( 
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


    SELECT *
    FROM followed_post
    WHERE posted_at < cursor_date
    -- AND (has_image = 'image/' OR image_only = false OR  image_only IS NULL)
    ORDER BY posted_at DESC
    LIMIT p_limit;

END