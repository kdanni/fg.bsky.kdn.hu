DROP PROCEDURE IF EXISTS SP_notUrbanEx18_algo;


CREATE PROCEDURE SP_notUrbanEx18_algo ( )
BEGIN
    
    SET @at_now = now();
    
    INSERT IGNORE INTO feed_post (feed_name, url, has_image, sfw, posted_at, created_at, updated_at)
    SELECT 
        '.notUrbanEx18' as feed_name,
        SUBSTRING( p.url, 1, 200) as url,
        p.has_image,
        p.sfw,
        p.posted_at,
        @at_now as created_at,
        @at_now as updated_at
    FROM feed_post p
    WHERE p.sfw <= 5
        AND p.feed_name = 'notUrbanEx'
        AND p.created_at > now() - INTERVAL 20 day
    ORDER BY posted_at -- Ordering helps prevent deadlocks
    ;    
    
    

END