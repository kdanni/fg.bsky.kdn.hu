-- CREATE TABLE IF NOT EXISTS translation (
--   url VARCHAR(200) NOT NULL,
--   langs VARCHAR(27) NOT NULL,
--   text TEXT,
--   translation TEXT,  
--   created_at datetime DEFAULT CURRENT_TIMESTAMP,
--   updated_at datetime DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (url),
--   INDEX (created_at),
--   INDEX (updated_at)
-- )

DROP PROCEDURE IF EXISTS upsert_translation;

-- - Create upsert stored procedure

CREATE PROCEDURE upsert_translation(
  IN p_url VARCHAR(200),
  IN p_langs VARCHAR(27),
  IN p_text TEXT,
  IN p_translation TEXT
)
BEGIN
  INSERT INTO translation (url, langs, text, translation)
  VALUES (p_url, p_langs, p_text, p_translation)
  ON DUPLICATE KEY UPDATE
    langs = p_langs,
    text = p_text,
    translation = p_translation,
    updated_at = CURRENT_TIMESTAMP;
END;
