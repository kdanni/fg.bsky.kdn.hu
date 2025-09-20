
DROP TABLE IF EXISTS quoted_post_old;
-- ALTER TABLE quoted_post RENAME quoted_post_old ;

CREATE TABLE IF NOT EXISTS quoted_post (
  url VARCHAR(255) NOT NULL,
  cid VARCHAR(255) NOT NULL,
  author_did VARCHAR(255) NOT NULL,
  reply_to_cid VARCHAR(255) DEFAULT NULL,  
  text TEXT NOT NULL,
  langs VARCHAR(27) DEFAULT 'en',
  facets JSON DEFAULT NULL,
  embeds JSON DEFAULT NULL, 
  labels JSON DEFAULT NULL, 
  has_image VARCHAR(64) NULL, 
  sfw INT DEFAULT 10,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (posted_at),
  INDEX (updated_at)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- INSERT INTO quoted_post ( url, cid, author_did, reply_to_cid, text, facets, embeds, has_image, posted_at, created_at, updated_at )
--   SELECT url, cid, author_did, reply_to_cid, text, facets, embeds, has_image, posted_at, created_at, updated_at
--   FROM quoted_post_old;

-- ALTER TABLE quoted_post ADD INDEX (posted_at);
-- ALTER TABLE quoted_post ADD INDEX (updated_at);


-- ALTER TABLE quoted_post
--   ADD COLUMN langs VARCHAR(27) DEFAULT 'en' AFTER text
-- ;

-- ALTER TABLE quoted_post
-- ADD COLUMN sfw INT DEFAULT 10 AFTER has_image;

-- ALTER TABLE quoted_post
-- ADD COLUMN labels JSON DEFAULT NULL AFTER embeds;