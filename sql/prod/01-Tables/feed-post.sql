DROP TABLE IF EXISTS feed_post_old;
-- ALTER TABLE feed_post RENAME feed_post_old ;

CREATE TABLE IF NOT EXISTS feed_post (
  feed_name VARCHAR(54) NOT NULL,
  url VARCHAR(200) NOT NULL,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (feed_name, url),
  INDEX (feed_name, posted_at),
  INDEX (posted_at),
  INDEX (feed_name)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- ALTER TABLE feed_post ADD INDEX (feed_name, posted_at);
-- ALTER TABLE feed_post ADD INDEX (posted_at);
-- ALTER TABLE feed_post ADD INDEX (feed_name);