-- DROP PROCEDURE IF EXISTS SP_DELETE_author_posts;


-- CREATE PROCEDURE SP_DELETE_author_posts ( 
--     author_handle VARCHAR(255)
-- )
-- BEGIN

--     IF (author_handle IS NOT NULL OR author_handle <> '') THEN
--         SET @author_did = 'dummy_did_SP_DELETE_author_posts';
--         SELECT @author_did = did
--         FROM bsky_author
--         WHERE handle = author_handle;

--         DELETE listed_post
--         WHERE url IN (
--             SELECT SUBSTRING( p.url, 1, 200)
--             FROM bsky_post p
--             WHERE p.author_did = @author_did
--         );
--         DELETE FROM bsky_post
--         WHERE author_did = @author_did;

--     END IF;

-- END