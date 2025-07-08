-- CREATE TABLE IF NOT EXISTS feed_post (
--   feed_name VARCHAR(54) NOT NULL,
--   url VARCHAR(200) NOT NULL,
--   posted_at datetime DEFAULT CURRENT_TIMESTAMP,
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,


DROP PROCEDURE IF EXISTS sp_SELECT_feed_posts_by_nameInArray;


CREATE PROCEDURE sp_SELECT_feed_posts_by_nameInArray ( 
    p_feed_name_array JSON,
    cursor_date datetime,
    p_limit INT
)
BEGIN
    
    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT *
    FROM feed_post
    WHERE feed_name IN (
        SELECT value COLLATE utf8mb4_hungarian_ci AS value
        FROM JSON_TABLE(p_feed_name_array, '$[*]' COLUMNS (value VARCHAR(54) PATH '$')) AS jt
    )
    AND posted_at < cursor_date
    ORDER BY posted_at DESC
    LIMIT p_limit;

END