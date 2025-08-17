DROP PROCEDURE IF EXISTS sp_SELECT_favorites_posts_by_cursor;

CREATE PROCEDURE sp_SELECT_favorites_posts_by_cursor ( 
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

    if p_actor is null then
        set p_actor = 'FEEDGEN_PUBLISHER';
    end if;

    SELECT 
        p.url,
        p.has_image,
        p.sfw,
        p.posted_at,
        p.created_at,
        p.updated_at
    FROM favorites_post p
    WHERE p.posted_at < cursor_date
        AND p.sfw >= p_sfw
        AND p.actor = p_actor
    ORDER BY p.posted_at DESC
    LIMIT p_limit;

END