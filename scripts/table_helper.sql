use test_db;
DELIMITER $$
DROP PROCEDURE IF EXISTS table_helper $$
CREATE PROCEDURE table_helper(IN TableName VARCHAR(255),IN Alias varchar(255))
BEGIN

SELECT 
    CONCAT('.input(`',COLUMN_NAME,'`, params.',COLUMN_NAME,')') AS nodeparams,
    CONCAT(
        '"',COLUMN_NAME,'" : ',
        CASE 
            WHEN data_type = 'varchar' THEN CONCAT('"',COLUMN_NAME,'"')
            WHEN data_type = 'datetime' THEN CONCAT('"',DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s'),'"')
            WHEN data_type = 'bool' THEN '1'
            WHEN data_type = 'bit' THEN '1'
            ELSE '1'
        END,
        ','
    ) AS nodebodyparams,
    CONCAT('"',COLUMN_NAME,'" : "',COLUMN_NAME,'",') AS nodebodyparams2,
    CONCAT(COLUMN_NAME,':',Alias,COLUMN_NAME,',') AS formdata,
    CONCAT(COLUMN_NAME,':',COLUMN_NAME) AS formdata,
    CONCAT(
        COLUMN_NAME, ': ',
        CASE 
            WHEN data_type = 'varchar' THEN COLUMN_NAME
            WHEN data_type = 'datetime' THEN DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:%s')
            WHEN data_type = 'bool' THEN '1'
            WHEN data_type = 'bit' THEN '1'
            ELSE '1'
        END
    ) AS formdata2,
    CONCAT(
        COLUMN_NAME,':',
        CASE 
            WHEN data_type = 'varchar' THEN 'string;'
            WHEN data_type = 'datetime' THEN 'string;'
            WHEN data_type = 'bool' THEN 'boolean;'
            WHEN data_type = 'bit' THEN 'boolean;'
            WHEN data_type = 'decimal' THEN 'number;'
            WHEN data_type = 'int' THEN 'number;'
            WHEN data_type = 'float' THEN 'number;'
            ELSE '1'
        END
    ) AS frontend_model,
    CONCAT('''',Alias,'.',COLUMN_NAME,'''',',',SPACE(10)) AS obj_column,
    CONCAT(Alias,'.',COLUMN_NAME,',',' ','AS `',TableName,'.',COLUMN_NAME,'`') AS Option1,
    COLUMN_NAME AS COLUMN_NAME,
    data_type,
    case         
       when data_type ='varchar' then CONCAT(data_type,'(',CHARACTER_MAXIMUM_LENGTH,')')        
       else data_type        
	end as datatype,
    CONCAT(COLUMN_NAME,',',SPACE(10)) as MainTableNODefaultInsert,        
	CONCAT(Alias,'.',COLUMN_NAME,',',SPACE(10)) as MainTableNODefault
    
	from
	INFORMATION_SCHEMA.COLUMNS where table_name = TableName;
END$$
DELIMITER ;