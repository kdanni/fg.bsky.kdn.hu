-- CREATE TABLE IF NOT EXISTS bsky_post (
--   url VARCHAR(255) NOT NULL,
--   cid VARCHAR(255) NOT NULL,
--   author_did VARCHAR(255) NOT NULL,
--   reply_to_cid VARCHAR(255) DEFAULT NULL,  
--   text TEXT NOT NULL,
--   facets JSON DEFAULT NULL,
--   embeds JSON DEFAULT NULL, 
--   has_image VARCHAR(64) NULL, 
--   posted_at datetime DEFAULT CURRENT_TIMESTAMP,
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (url)

-- CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;

DROP PROCEDURE IF EXISTS SP_SELECT_recent_posts_by_authorInArray;

--   author_did VARCHAR(255) NOT NULL,
CREATE PROCEDURE SP_SELECT_recent_posts_by_authorInArray ( 
    p_author_array JSON
)
BEGIN

    -- recent posts are created in the last 5 days
    SET @days_ago = DATE_SUB(CURDATE(), INTERVAL 5 DAY);
    
    SELECT *
    FROM bsky_post
    WHERE created_at >= @days_ago
        AND author_did IN (
            SELECT value COLLATE utf8mb4_hungarian_ci AS value
            FROM JSON_TABLE(p_author_array, '$[*]' COLUMNS (value VARCHAR(255) PATH '$')) AS jt
        )
    ORDER BY posted_at ASC;

END