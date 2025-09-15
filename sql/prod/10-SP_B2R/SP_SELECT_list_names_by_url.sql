
DROP PROCEDURE IF EXISTS SP_SELECT_list_names_by_url;


CREATE PROCEDURE SP_SELECT_list_names_by_url ( 
    p_url VARCHAR(200)
)
BEGIN

    SELECT list_name
    FROM listed_post
    WHERE url = p_url
    GROUP BY list_name;

END