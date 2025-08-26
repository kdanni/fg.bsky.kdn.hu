-- UPSERT SP update or insert

CREATE PROCEDURE upsert_backfill_search_query (
  IN p_query VARCHAR(255),
  IN p_data JSON,
  IN p_sfw INT
)
BEGIN
  INSERT INTO backfill_search_query (query, data, sfw)
  VALUES (p_query, p_data, p_sfw)
  ON DUPLICATE KEY UPDATE
    data = p_data,
    sfw = p_sfw,
    updated_at = CURRENT_TIMESTAMP;
END;
