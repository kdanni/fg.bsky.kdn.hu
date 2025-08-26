
DROP TABLE IF EXISTS backfill_search_query_old;
-- ALTER TABLE backfill_search_query RENAME backfill_search_query_old ;

CREATE TABLE IF NOT EXISTS backfill_search_query (
  query VARCHAR(255) NOT NULL,
  data JSON DEFAULT NULL,
  sfw INT DEFAULT 10,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (query),
  INDEX (sfw),
  INDEX (updated_at)  
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;