DROP PROCEDURE IF EXISTS SP_nsfw_post_algo;


CREATE PROCEDURE SP_nsfw_post_algo ( 
    author_did VARCHAR(255),
    list_name VARCHAR(54)
)
BEGIN
    
    IF (author_did IS NOT NULL OR author_did <> '') THEN
        SET @at_now = now();
        
          
    END IF;   

END