DROP TABLE IF EXISTS listed_post_old;
-- ALTER TABLE listed_post RENAME listed_post_old ;

CREATE TABLE IF NOT EXISTS listed_post (
  url VARCHAR(200) NOT NULL,
  list_name VARCHAR(54) NOT NULL,  
  has_image VARCHAR(64) DEFAULT NULL,
  sfw INT DEFAULT 10,
  posted_at datetime DEFAULT CURRENT_TIMESTAMP,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (url),
  INDEX (list_name, posted_at),
  INDEX (posted_at),
  INDEX (list_name)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- ALTER TABLE listed_post ADD INDEX (list_name, posted_at);
-- ALTER TABLE listed_post ADD INDEX (posted_at);
-- ALTER TABLE listed_post ADD INDEX (list_name);


-- ALTER TABLE listed_post
-- ADD COLUMN sfw INT DEFAULT 10 AFTER has_image;