
DROP PROCEDURE IF EXISTS SP_SELECT_bsky_posts;

CREATE PROCEDURE SP_SELECT_bsky_posts ( 
    cursor_date datetime,
    p_limit INT
)
BEGIN

    if p_limit is null or p_limit <= 0 then
        set p_limit = 30;
    end if;

    SELECT p.url as post_url, p.cid as post_cid, p.author_did as p_author_did,
        a.did as a_author_did, a.handle as author_handle, a.displayName as author_displayName,
        a.avatar as author_avatar, p.reply_to_cid as reply_to_cid, p.text as text,
        p.facets as facets, p.embeds as embeds, p.has_image as has_image,
        p.posted_at as posted_at, p.created_at as created_at, p.updated_at as updated_at
    FROM bsky_post p
    LEFT JOIN bsky_author a ON p.author_did = a.did
    WHERE p.posted_at > cursor_date
    ORDER BY p.posted_at ASC
    LIMIT p_limit;

END