DROP PROCEDURE IF EXISTS SP_hun_lang_algo;


CREATE PROCEDURE SP_hun_lang_algo ( )
BEGIN
    
    SET @at_now = now();
    
    INSERT IGNORE INTO feed_post (feed_name, url, has_image, sfw, posted_at, created_at, updated_at)
    SELECT
        'hunLangAll',
        SUBSTRING( p.url, 1, 200),
        p.has_image,
        p.sfw,
        p.posted_at,
        @at_now,
        @at_now
    FROM bsky_post p
    WHERE p.langs = 'hu'
        AND NOT ( JSON_EXTRACT(embeds, '$.$type') = 'app.bsky.embed.record' AND text = '' )
    ;    
    
    INSERT IGNORE INTO feed_post (feed_name, url, has_image, sfw, posted_at, created_at, updated_at)
    SELECT
        'hunLangImages',
        SUBSTRING( p.url, 1, 200),
        p.has_image,
        p.sfw,
        p.posted_at,
        @at_now,
        @at_now
    FROM bsky_post p
    WHERE p.langs = 'hu' AND p.has_image LIKE 'image/%'
        AND NOT ( JSON_EXTRACT(embeds, '$.$type') = 'app.bsky.embed.record' AND text = '' )
    ;    

END