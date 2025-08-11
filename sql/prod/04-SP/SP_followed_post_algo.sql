DROP PROCEDURE IF EXISTS SP_followed_post_algo;


CREATE PROCEDURE SP_followed_post_algo ( 
    author_did VARCHAR(255)
)
BEGIN
    
    IF (author_did IS NOT NULL OR author_did <> '') THEN
        SET @at_now = now();
        
        INSERT IGNORE INTO followed_post (url, has_image, posted_at, created_at, updated_at)
        SELECT
            SUBSTRING( p.url, 1, 200),
            p.has_image,
            p.posted_at,
            @at_now,
            @at_now
        FROM bsky_post p
        WHERE p.author_did = author_did
            AND NOT ( JSON_EXTRACT(embeds, '$.$type') = 'app.bsky.embed.record' AND text = '' )
        ;    
    END IF;   

END