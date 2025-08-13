DROP TABLE IF EXISTS translation_old;
-- ALTER TABLE feed_post RENAME feed_post_old ;

CREATE TABLE IF NOT EXISTS translation (
  url VARCHAR(200) NOT NULL,
  langs VARCHAR(27) NOT NULL,
  text TEXT,
  translation TEXT,  
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (created_at),
  INDEX (updated_at)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
