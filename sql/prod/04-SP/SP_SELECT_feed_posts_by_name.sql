-- CREATE TABLE IF NOT EXISTS feed_post (
--   feed_name VARCHAR(54) NOT NULL,
--   url VARCHAR(200) NOT NULL,
--   posted_at datetime DEFAULT CURRENT_TIMESTAMP,
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,


DROP PROCEDURE IF EXISTS sp_SELECT_feed_posts_by_name;


CREATE PROCEDURE sp_SELECT_feed_posts_by_name ( 
    p_feed_name VARCHAR(54),
    cursor_date datetime,
    p_limit INT,
    p_sfw INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    if p_sfw is null or p_sfw < 0 then
        set p_sfw = 10;
    end if;

--   feed_name VARCHAR(54) NOT NULL,
--   url VARCHAR(200) NOT NULL,
--   posted_at datetime DEFAULT CURRENT_TIMESTAMP,
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,

    SELECT 
        p.feed_name,
        p.url,
        p.posted_at,
        p.created_at,
        p.updated_at
    FROM feed_post p
    WHERE p.feed_name = p_feed_name
    AND p.posted_at < cursor_date
    AND p.sfw >= p_sfw
    ORDER BY p.posted_at DESC
    LIMIT p_limit;

END