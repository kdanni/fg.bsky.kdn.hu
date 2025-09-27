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


    UPDATE feed_post f
    JOIN bsky_post p ON f.url = p.url
    SET f.sfw = LEAST( p.sfw, f.sfw ),
        f.has_image = p.has_image,        
        f.updated_at = now()
    WHERE f.feed_name LIKE 'hunLang%'
        AND p.sfw < 6
        AND p.updated_at > now() - INTERVAL 5 DAY;

END