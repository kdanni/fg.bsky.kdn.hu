-- CREATE TABLE IF NOT EXISTS feed_post (
--   feed_name VARCHAR(54) NOT NULL,
--   url VARCHAR(200) NOT NULL,
--   posted_at datetime DEFAULT CURRENT_TIMESTAMP,
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,


DROP PROCEDURE IF EXISTS SP_SELECT_feed_names_by_url;


CREATE PROCEDURE SP_SELECT_feed_names_by_url ( 
    p_url VARCHAR(200)
)
BEGIN

    SELECT feed_name
    FROM feed_post
    WHERE url = p_url
    GROUP BY feed_name;

END