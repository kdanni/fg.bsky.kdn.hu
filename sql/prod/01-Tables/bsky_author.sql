
DROP TABLE IF EXISTS bsky_author_old;
-- ALTER TABLE bsky_author RENAME bsky_author_old ;

CREATE TABLE IF NOT EXISTS bsky_author (
  did VARCHAR(255) NOT NULL,
  handle VARCHAR(255) NOT NULL,
  displayName VARCHAR(255) NULL,
  avatar VARCHAR(255) NULL,
  data JSON DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (did)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;


-- INSERT INTO bsky_author ( id, name, created_at, updated_at )
--   SELECT id, name, created_at, updated_at
--   FROM bsky_author_old;