DROP PROCEDURE IF EXISTS SP_tag_MIME;

CREATE PROCEDURE SP_tag_MIME (
    p_author_did VARCHAR(255),
    p_tag VARCHAR(25)
)
BEGIN

    -- Construct a where like string '%p_author_did%'
    SET @where_like = CONCAT('%', p_author_did, '%');
    SET @tag_like = CONCAT('%', p_tag, '%');

    -- Update the post table with the new mime_tag value
    UPDATE bsky_post
    SET has_image = CASE
        WHEN has_image LIKE @tag_like THEN has_image
        ELSE CONCAT(has_image, '::', p_tag)
    END
    WHERE url LIKE @where_like;

    UPDATE feed_post
    SET has_image = CASE
        WHEN has_image LIKE @tag_like THEN has_image
        ELSE CONCAT(has_image, '::', p_tag)
    END
    WHERE url LIKE @where_like;
    
END