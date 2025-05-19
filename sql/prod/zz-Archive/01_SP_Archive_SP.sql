
DROP PROCEDURE IF EXISTS sp_Archive_SP;

CREATE PROCEDURE sp_Archive_SP ()
BEGIN

    -- 1 xml file by url
    -- DELETE FROM r2r_raw_xml WHERE updated_at < now() - INTERVAL 40 day;
    
    -- 1 row by rss items and atom entries  
    -- DELETE FROM r2r_rss_items WHERE updated_at < now() - INTERVAL 40 day;
    -- DELETE FROM r2r_atom_entries WHERE updated_at < now() - INTERVAL 40 day;


    -- DELETE FROM r2r_result_items WHERE created_at < now() - INTERVAL 40 day;
    -- DELETE FROM r2r_result_article WHERE created_at < now() - INTERVAL 40 day;



    -- DELETE FROM youtube_video_data WHERE created_at < now() - INTERVAL 40 day;
    -- DELETE FROM youtube_videoid WHERE created_at < now() - INTERVAL 400 day;



    -- Other

    -- DELETE FROM r2r_img_src WHERE created_at < now() - INTERVAL 32 day;
    -- DELETE FROM podcast_mp3 WHERE created_at < now() - INTERVAL 32 day;

END