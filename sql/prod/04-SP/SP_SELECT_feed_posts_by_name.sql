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
    p_sfw TINYINT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT *
    FROM feed_post
    LEFT JOIN bsky_post_labels ON feed_post.url = bsky_post_labels.url
    WHERE feed_name = p_feed_name
    AND posted_at < cursor_date
    AND (p_sfw = 0 OR bsky_post_labels.nsfw = 0)
    ORDER BY posted_at DESC
    LIMIT p_limit;

END