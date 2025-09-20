DROP PROCEDURE IF EXISTS sp_SELECT_recent_jetstream_post;


CREATE PROCEDURE sp_SELECT_recent_jetstream_post ()
BEGIN

    -- recent posts are created in the last 10 days
    SET @days_ago = DATE_SUB(CURDATE(), INTERVAL 10 DAY);
    
    SELECT *
    FROM bsky_post
    WHERE created_at >= @days_ago
        AND cid LIKE 'jetstream::%'
    ORDER BY posted_at ASC;

END