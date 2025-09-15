-- CREATE TABLE IF NOT EXISTS feed_post (
--   feed_name VARCHAR(54) NOT NULL,
--   url VARCHAR(200) NOT NULL,
--   posted_at datetime DEFAULT CURRENT_TIMESTAMP,
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,


DROP PROCEDURE IF EXISTS sp_SELECT_nsfw_feed_posts_by_cursor;


CREATE PROCEDURE sp_SELECT_nsfw_feed_posts_by_cursor ( 
    cursor_date datetime,
    p_limit INT,
    p_sfw INT,
    p_actor VARCHAR(200)
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;
    
    -- if p_sfw is null or p_sfw < 0 then
    --     set p_sfw = 10;
    -- end if;

    -- if p_actor is null then
    --     set p_actor = 'FEEDGEN_PUBLISHER';
    -- end if;

    SELECT 
        *
    FROM feed_post p
    WHERE p.posted_at < cursor_date
        AND p.sfw <= 5
    ORDER BY p.posted_at DESC
    LIMIT p_limit;

END