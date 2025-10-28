-- UPSERT SP update or insert
DROP PROCEDURE IF EXISTS upsert_author_algo_logic;

CREATE PROCEDURE upsert_author_algo_logic (
    IN p_feed_name VARCHAR(54),
    IN p_data JSON,
    IN p_mediaRegex VARCHAR(200),
    IN p_sfw INT,
    IN p_sfwLimit INT
)
BEGIN
    INSERT INTO author_algo_logic (feed_name, data, mediaRegex, sfw, sfwLimit)
    VALUES (p_feed_name, p_data, p_mediaRegex, p_sfw, p_sfwLimit)
    ON DUPLICATE KEY UPDATE
        data = p_data,
        mediaRegex = p_mediaRegex,
        sfw = p_sfw,
        sfwLimit = p_sfwLimit,
        updated_at = CURRENT_TIMESTAMP;
END;