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

DROP PROCEDURE IF EXISTS sp_SELECT_old_posts;

--   author_did VARCHAR(255) NOT NULL,
CREATE PROCEDURE sp_SELECT_old_posts ( 
    p_author_did VARCHAR(255)
)
BEGIN

    -- recent posts are created in the last 5 years
    SET @days_ago = DATE_SUB(CURDATE(), INTERVAL 5 YEAR);
    
    SELECT *
    FROM bsky_post
    WHERE created_at >= @days_ago
        AND (author_did = p_author_did OR p_author_did IS NULL)
    ORDER BY posted_at ASC;

END