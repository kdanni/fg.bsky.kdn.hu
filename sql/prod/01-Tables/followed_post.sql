DROP TABLE IF EXISTS followed_post_old;
-- ALTER TABLE followed_post RENAME followed_post_old ;

CREATE TABLE IF NOT EXISTS followed_post (
  url VARCHAR(200) NOT NULL,
  has_image VARCHAR(64) DEFAULT NULL,
  sfw INT DEFAULT 10,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (has_image, posted_at),
  INDEX (posted_at),
  INDEX (has_image)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- ALTER TABLE followed_post ADD INDEX (has_image, posted_at);
-- ALTER TABLE followed_post ADD INDEX (posted_at);
-- ALTER TABLE followed_post ADD INDEX (has_image);


-- ALTER TABLE followed_post
-- ADD COLUMN sfw INT DEFAULT 10 AFTER has_image;