
DROP TABLE IF EXISTS nsfw_handle_old;
-- ALTER TABLE nsfw_handle RENAME nsfw_handle_old ;

CREATE TABLE IF NOT EXISTS nsfw_handle (
  handle VARCHAR(255) NOT NULL,
  active INT DEFAULT 1,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (handle)
)
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;