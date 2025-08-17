DROP TABLE IF EXISTS favorites_post_old;
-- ALTER TABLE favorites_post RENAME favorites_post_old ;

CREATE TABLE IF NOT EXISTS favorites_post (
  url VARCHAR(200) NOT NULL,
  has_image VARCHAR(64) DEFAULT NULL,
  sfw INT DEFAULT 10,
  actor VARCHAR(200) NOT NULL,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (posted_at)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
