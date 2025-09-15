DROP PROCEDURE IF EXISTS SP_listed_post_algo;


CREATE PROCEDURE SP_listed_post_algo ( 
    author_did VARCHAR(255),
    list_name VARCHAR(54)
)
BEGIN
    
    IF (author_did IS NOT NULL OR author_did <> '') THEN
        SET @at_now = now();
        
        INSERT IGNORE INTO listed_post (url, has_image, list_name, sfw, posted_at, created_at, updated_at)
        SELECT
            SUBSTRING( p.url, 1, 200),
            p.has_image,
            list_name,
            p.sfw,
            p.posted_at,
            @at_now,
            @at_now
        FROM bsky_post p
        WHERE p.author_did = author_did;    
    END IF;   

END