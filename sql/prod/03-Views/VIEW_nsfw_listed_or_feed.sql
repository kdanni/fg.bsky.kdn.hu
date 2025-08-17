
CREATE OR REPLACE VIEW VIEW_nsfw_listed_or_feed AS
SELECT url, sfw, posted_at, created_at, updated_at, source, has_image, 
  source as feed_name, source as list_name
FROM (
  SELECT url, sfw, posted_at, created_at, updated_at, list_name AS source, has_image
    FROM listed_post
    WHERE list_name = 'NSFW'
  UNION ALL
  SELECT url, sfw, posted_at, created_at, updated_at, feed_name AS source, 'feed_post' as has_image
    FROM feed_post
    WHERE sfw < 2 AND feed_name <> 'food-images'
) as combined_posts
ORDER BY posted_at DESC;

-- CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
