
DROP TABLE IF EXISTS bsky_post_labels_old;
-- ALTER TABLE bsky_post RENAME bsky_post_old ;

CREATE TABLE IF NOT EXISTS bsky_post_labels (
  url VARCHAR(255) NOT NULL,
  author_did VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  langs VARCHAR(27) DEFAULT 'en',
  has_image VARCHAR(64) NULL, 
  labels JSON DEFAULT NULL,
  custom_labels JSON DEFAULT NULL,
  nsfw INT DEFAULT 0,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (posted_at),
  INDEX (updated_at),
  INDEX (url)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- INSERT INTO bsky_post ( url, cid, author_did, reply_to_cid, text, facets, embeds, has_image, posted_at, created_at, updated_at )
--   SELECT url, cid, author_did, reply_to_cid, text, facets, embeds, has_image, posted_at, created_at, updated_at
--   FROM bsky_post_old;

-- ALTER TABLE bsky_post ADD INDEX (posted_at);
-- ALTER TABLE bsky_post ADD INDEX (updated_at);


-- ALTER TABLE bsky_post
--   ADD COLUMN langs VARCHAR(27) DEFAULT 'en' AFTER text
-- ;