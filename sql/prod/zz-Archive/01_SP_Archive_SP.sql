
DROP PROCEDURE IF EXISTS sp_Archive_SP;

CREATE PROCEDURE sp_Archive_SP ()
BEGIN

    -- DELETE old posts
    DELETE FROM bsky_post WHERE updated_at < now() - INTERVAL 40 day;
    DELETE FROM bsky_post WHERE posted_at < now() - INTERVAL 100 day;
    

    DELETE FROM quoted_post WHERE updated_at < now() - INTERVAL 10 day;
    -- DELETE FROM quoted_post WHERE posted_at < now() - INTERVAL 20 day;

    DELETE FROM translation WHERE created_at < now() - INTERVAL 20 day;
    

    DELETE FROM listed_post WHERE updated_at < now() - INTERVAL 40 day;
    DELETE FROM listed_post WHERE posted_at < now() - INTERVAL 100 day;
    
    
    DELETE FROM bsky_author WHERE updated_at < now() - INTERVAL 365 day;


END