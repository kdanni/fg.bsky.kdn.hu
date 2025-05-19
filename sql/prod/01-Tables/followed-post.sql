DROP TABLE IF EXISTS followed_post_old;
-- ALTER TABLE followed_post RENAME followed_post_old ;

CREATE TABLE IF NOT EXISTS followed_post (
  url VARCHAR(200) NOT NULL,
  has_image VARCHAR(64) DEFAULT NULL,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
