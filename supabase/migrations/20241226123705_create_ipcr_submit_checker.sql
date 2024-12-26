-- First create the type if it doesn't exist
DROP TYPE IF EXISTS validation_result CASCADE;
CREATE TYPE validation_result AS (
 is_valid boolean,
 validation_message text
);

-- Create the validation function
CREATE OR REPLACE FUNCTION validate_ipcr(p_ipcr_id UUID)
RETURNS validation_result
LANGUAGE plpgsql
AS $$
DECLARE
 result validation_result;
 invalid_function RECORD;
 invalid_indicator RECORD;
BEGIN
 -- Check if IPCR has at least one function
 IF NOT EXISTS (
   SELECT 1 FROM ipcr_function 
   WHERE ipcr_id = p_ipcr_id
 ) THEN
   result := (false, 'IPCR must have at least one function');
   RETURN result;
 END IF;

 -- Check if each function has at least one indicator (from function, category or subcategory)
 SELECT 
   f.id,
   f.title
 INTO invalid_function
 FROM ipcr_function f
 WHERE f.ipcr_id = p_ipcr_id
 AND NOT EXISTS (
   -- Check direct function indicators
   SELECT 1 FROM ipcr_indicator i 
   WHERE i.ipcr_function_id = f.id
   UNION ALL
   -- Check category indicators
   SELECT 1 FROM ipcr_function_category fc
   JOIN ipcr_indicator i ON i.ipcr_function_category_id = fc.id
   WHERE fc.ipcr_function_id = f.id
   UNION ALL
   -- Check subcategory indicators
   SELECT 1 FROM ipcr_function_category fc
   JOIN ipcr_function_sub_category fsc ON fsc.ipcr_function_category_id = fc.id
   JOIN ipcr_indicator i ON i.ipcr_function_sub_category_id = fsc.id
   WHERE fc.ipcr_function_id = f.id
 )
 LIMIT 1;

 IF FOUND THEN
   result := (false, format('Function "%s": No indicators found at any level', invalid_function.title));
   RETURN result;
 END IF;

 -- Check basic requirements for all indicators
 SELECT 
   CASE
     WHEN i.final_output IS NULL THEN 'Missing Final Output'
     WHEN i.success_indicator IS NULL THEN 'Missing Success Indicator'
     WHEN i.op_activity_id IS NULL THEN 'Missing Operational Plan Activity'
   END as missing_field,
   COALESCE(f.title, fc.category, fsc.sub_category) as parent_name
 INTO invalid_indicator
 FROM ipcr_indicator i
 LEFT JOIN ipcr_function f ON f.id = i.ipcr_function_id
 LEFT JOIN ipcr_function_category fc ON fc.id = i.ipcr_function_category_id
 LEFT JOIN ipcr_function_sub_category fsc ON fsc.id = i.ipcr_function_sub_category_id
 WHERE (f.ipcr_id = p_ipcr_id OR 
        EXISTS(SELECT 1 FROM ipcr_function parent_f 
               WHERE parent_f.ipcr_id = p_ipcr_id 
               AND fc.ipcr_function_id = parent_f.id))
 AND (
   i.final_output IS NULL OR
   i.success_indicator IS NULL OR
   i.op_activity_id IS NULL
 )
 LIMIT 1;

 IF FOUND THEN
   result := (false, format('In %s: %s', 
                           invalid_indicator.parent_name,
                           invalid_indicator.missing_field));
   RETURN result;
 END IF;

 -- Special check for indicators directly under function
 SELECT 
   CASE
     WHEN i.immediate_supervisor_id IS NULL THEN 'Missing Immediate Supervisor'
     WHEN i.units IS NULL THEN 'Missing Units'
   END as missing_field,
   f.title as function_title
 INTO invalid_indicator
 FROM ipcr_indicator i
 JOIN ipcr_function f ON f.id = i.ipcr_function_id
 WHERE f.ipcr_id = p_ipcr_id
 AND i.ipcr_function_category_id IS NULL 
 AND i.ipcr_function_sub_category_id IS NULL
 AND (
   i.immediate_supervisor_id IS NULL OR
   i.units IS NULL
 )
 LIMIT 1;

 IF FOUND THEN
   result := (false, format('Direct indicator under function "%s": %s', 
                           invalid_indicator.function_title,
                           invalid_indicator.missing_field));
   RETURN result;
 END IF;

 -- If we get here, everything is valid
 result := (true, 'IPCR is complete and valid');
 RETURN result;
END;
$$;