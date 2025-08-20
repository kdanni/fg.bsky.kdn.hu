DROP TABLE IF EXISTS feed_post_old;
-- ALTER TABLE feed_post RENAME feed_post_old ;

CREATE TABLE IF NOT EXISTS feed_post (
  feed_name VARCHAR(54) NOT NULL,
  url VARCHAR(200) NOT NULL,
  sfw INT DEFAULT 10,
  has_image VARCHAR(64) NULL, 
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (feed_name, url),
  INDEX (feed_name, posted_at),
  INDEX (posted_at),
  INDEX (feed_name, posted_at, has_image),  
  INDEX (feed_name, has_image),
  INDEX (has_image)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- ALTER TABLE feed_post ADD INDEX (feed_name, posted_at);
-- ALTER TABLE feed_post ADD INDEX (posted_at);
-- ALTER TABLE feed_post ADD INDEX (feed_name);

-- ALTER TABLE feed_post
-- ADD COLUMN sfw INT DEFAULT 10 AFTER url;


-- ALTER TABLE feed_post
-- ADD COLUMN has_image VARCHAR(64) NULL AFTER sfw;