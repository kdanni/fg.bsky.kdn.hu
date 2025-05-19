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
    p_limit INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT *
    FROM feed_post
    WHERE feed_name = p_feed_name
    AND posted_at < cursor_date
    ORDER BY posted_at DESC
    LIMIT p_limit;

END