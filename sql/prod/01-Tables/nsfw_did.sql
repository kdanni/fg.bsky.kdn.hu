
DROP TABLE IF EXISTS nsfw_did_old;
-- ALTER TABLE nsfw_did RENAME nsfw_did_old ;

CREATE TABLE IF NOT EXISTS nsfw_did (
  did VARCHAR(255) NOT NULL,
  active INT DEFAULT 1,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (did)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;