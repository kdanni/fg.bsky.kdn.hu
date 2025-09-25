
DROP PROCEDURE IF EXISTS sp_SELECT_not_recent_posts_by_text_and_cursor;

--   author_did VARCHAR(255) NOT NULL,
CREATE PROCEDURE sp_SELECT_not_recent_posts_by_text_and_cursor ( 
    p_text TEXT,
    p_cursor DATETIME,
    p_limit INT
)
BEGIN

    IF p_cursor IS NULL THEN
        SET p_cursor = DATE_SUB(CURDATE(), INTERVAL 20 YEAR);
    END IF;

    IF p_cursor > DATE_SUB(CURDATE(), INTERVAL 4 DAY) THEN
        SELECT * FROM bsky_post WHERE 1=0;
    ELSE
        
        IF p_limit IS NULL THEN
            SET p_limit = 100;
        END IF;
        
        SELECT *
        FROM bsky_post
        WHERE posted_at > p_cursor
            AND text LIKE p_text
        ORDER BY posted_at ASC
        LIMIT p_limit;
        
    END IF;
    
END