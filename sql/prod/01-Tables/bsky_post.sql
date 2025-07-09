
DROP TABLE IF EXISTS bsky_post_old;
-- ALTER TABLE bsky_post RENAME bsky_post_old ;

CREATE TABLE IF NOT EXISTS bsky_post (
  url VARCHAR(255) NOT NULL,
  cid VARCHAR(255) NOT NULL,
  author_did VARCHAR(255) NOT NULL,
  reply_to_cid VARCHAR(255) DEFAULT NULL,  
  text TEXT NOT NULL,
  facets JSON DEFAULT NULL,
  embeds JSON DEFAULT NULL, 
  has_image VARCHAR(64) NULL, 
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (posted_at),
  INDEX (updated_at)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- INSERT INTO bsky_post ( url, cid, author_did, reply_to_cid, text, facets, embeds, has_image, posted_at, created_at, updated_at )
--   SELECT url, cid, author_did, reply_to_cid, text, facets, embeds, has_image, posted_at, created_at, updated_at
--   FROM bsky_post_old;

-- ALTER TABLE bsky_post ADD INDEX (posted_at);
-- ALTER TABLE bsky_post ADD INDEX (updated_at);