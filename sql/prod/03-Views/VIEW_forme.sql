
CREATE OR REPLACE VIEW VIEW_forME AS
SELECT url, sfw, posted_at, created_at, updated_at, source, has_image, 
  source as feed_name, source as list_name
FROM (
  SELECT url, sfw, posted_at, created_at, updated_at, 'followed_post' AS source, has_image
    FROM followed_post
  UNION ALL
  SELECT url, sfw, posted_at, created_at, updated_at, 'forme_post' AS source, has_image
    FROM forme_post
) as combined_posts
ORDER BY posted_at DESC;

-- CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
