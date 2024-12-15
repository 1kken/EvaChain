-- First create a type to hold the validation result
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
  core_count INTEGER;
  support_count INTEGER;
  other_count INTEGER;
  sub_core_count INTEGER;
  sub_support_count INTEGER;
  sub_other_count INTEGER;
  invalid_indicators RECORD;
BEGIN
  -- Check core functions count
  SELECT COUNT(*) INTO core_count
  FROM core_function
  WHERE ipcr_id = p_ipcr_id;
  
  IF core_count < 1 THEN
    result := (false, 'Must have at least 1 core function');
    RETURN result;
  END IF;

  -- Check support functions count
  SELECT COUNT(*) INTO support_count
  FROM support_function
  WHERE ipcr_id = p_ipcr_id;
  
  IF support_count < 1 THEN
    result := (false, 'Must have at least 1 support function');
    RETURN result;
  END IF;

  -- Check other functions count
  SELECT COUNT(*) INTO other_count
  FROM other_function
  WHERE ipcr_id = p_ipcr_id;
  
  IF other_count < 1 THEN
    result := (false, 'Must have at least 1 other function');
    RETURN result;
  END IF;

  -- Check sub-core functions
  SELECT COUNT(*) INTO sub_core_count
  FROM core_function cf
  JOIN sub_core_function scf ON cf.id = scf.core_function_id
  WHERE cf.ipcr_id = p_ipcr_id;
  
  IF sub_core_count < 1 THEN
    result := (false, 'Must have at least 1 sub-core function');
    RETURN result;
  END IF;

  -- Check sub-support functions
  SELECT COUNT(*) INTO sub_support_count
  FROM support_function sf
  JOIN sub_support_function ssf ON sf.id = ssf.support_function_id
  WHERE sf.ipcr_id = p_ipcr_id;
  
  IF sub_support_count < 1 THEN
    result := (false, 'Must have at least 1 sub-support function');
    RETURN result;
  END IF;

  -- Check sub-other functions
  SELECT COUNT(*) INTO sub_other_count
  FROM other_function of
  JOIN sub_other_function sof ON of.id = sof.other_function_id
  WHERE of.ipcr_id = p_ipcr_id;
  
  IF sub_other_count < 1 THEN
    result := (false, 'Must have at least 1 sub-other function');
    RETURN result;
  END IF;

  -- Check for incomplete indicators
  SELECT 
    i.id,
    CASE
      WHEN i.indicator IS NULL THEN 'indicator'
      WHEN i.accomplishment IS NULL THEN 'accomplishment'
      WHEN i.indicator_date IS NULL THEN 'indicator_date'
      WHEN i.accomplishment_date IS NULL THEN 'accomplishment_date'
      WHEN i.quality_rating IS NULL THEN 'quality_rating'
      WHEN i.efficiency_rating IS NULL THEN 'efficiency_rating'
      WHEN i.timeliness_rating IS NULL THEN 'timeliness_rating'
      WHEN i.average_rating IS NULL THEN 'average_rating'
    END as missing_field
  INTO invalid_indicators
  FROM indicator i
  LEFT JOIN core_function cf ON i.core_function_id = cf.id
  LEFT JOIN support_function sf ON i.support_function_id = sf.id
  LEFT JOIN other_function of ON i.other_function_id = of.id
  WHERE (cf.ipcr_id = p_ipcr_id OR sf.ipcr_id = p_ipcr_id OR of.ipcr_id = p_ipcr_id)
  AND (
    i.indicator IS NULL OR
    i.accomplishment IS NULL OR
    i.indicator_date IS NULL OR
    i.accomplishment_date IS NULL OR
    i.quality_rating IS NULL OR
    i.efficiency_rating IS NULL OR
    i.timeliness_rating IS NULL OR
    i.average_rating IS NULL
  )
  LIMIT 1;

  IF FOUND THEN
    result := (false, format('Incomplete indicator found (ID: %s). Missing field: %s', 
                            invalid_indicators.id, 
                            invalid_indicators.missing_field));
    RETURN result;
  END IF;

  -- If we get here, everything is valid
  result := (true, 'IPCR is complete and valid');
  RETURN result;
END;
$$;