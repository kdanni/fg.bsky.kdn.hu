DROP PROCEDURE IF EXISTS SP_forme_author_algo;


CREATE PROCEDURE SP_forme_author_algo ( )
BEGIN
    
    SET @at_now = now();
    
    INSERT IGNORE INTO forme_post (url, has_image, sfw, posted_at, created_at, updated_at)
    SELECT
        SUBSTRING( p.url, 1, 200),
        p.has_image,
        p.sfw,
        p.posted_at,
        @at_now,
        @at_now
    FROM feed_post p
    WHERE feed_name LIKE '@%'
    ;
    

END