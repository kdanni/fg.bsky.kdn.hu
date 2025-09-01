
DROP TABLE IF EXISTS custom_feed_logic_old;
-- ALTER TABLE custom_feed_logic RENAME custom_feed_logic_old ;

CREATE TABLE IF NOT EXISTS custom_feed_logic (
  feed_name VARCHAR(54) NOT NULL,
  data JSON DEFAULT NULL,
  mediaRegex VARCHAR(200) DEFAULT NULL,
  sfw INT DEFAULT 10,
  sfwLimit INT DEFAULT 2,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (feed_name),
  INDEX (sfw),
  INDEX (updated_at)  
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
