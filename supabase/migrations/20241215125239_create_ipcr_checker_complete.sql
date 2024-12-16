-- First create the type
DROP TYPE IF EXISTS validation_result CASCADE;
CREATE TYPE validation_result AS (
  is_valid boolean,
  validation_message text
);

CREATE OR REPLACE FUNCTION validate_ipcr(p_ipcr_id UUID)
RETURNS validation_result
LANGUAGE plpgsql
AS $$
DECLARE
  result validation_result;
  invalid_function RECORD;
  has_core boolean;
  has_support boolean;
  has_other boolean;
BEGIN
  -- Check if IPCR has required function types
  SELECT 
    EXISTS(SELECT 1 FROM core_function WHERE ipcr_id = p_ipcr_id) as has_core,
    EXISTS(SELECT 1 FROM support_function WHERE ipcr_id = p_ipcr_id) as has_support,
    EXISTS(SELECT 1 FROM other_function WHERE ipcr_id = p_ipcr_id) as has_other
  INTO has_core, has_support, has_other;

  -- Check for missing function types
  IF NOT has_core THEN
    result := (false, 'Core Function: Missing Core Functions');
    RETURN result;
  END IF;

  IF NOT has_support THEN
    result := (false, 'Support Function: Missing Support Functions');
    RETURN result;
  END IF;

  IF NOT has_other THEN
    result := (false, 'Other Function: Missing Other Functions');
    RETURN result;
  END IF;

  -- Check core functions
  SELECT 
    cf.id,
    cf.name,
    'Core' as function_type,
    CASE
      WHEN cf.unit IS NULL AND cf.reviewer_id IS NULL THEN 'Missing Fields: Unit and Reviewer'
      WHEN cf.unit IS NULL THEN 'Missing Field: Unit'
      WHEN cf.reviewer_id IS NULL THEN 'Missing Field: Reviewer'
      WHEN EXISTS (
        SELECT 1 FROM indicator i 
        WHERE i.core_function_id = cf.id
        AND i.sub_core_function_id IS NULL
        AND (
          i.indicator IS NULL OR
          i.indicator_date IS NULL
        )
      ) OR EXISTS (
        SELECT 1 FROM sub_core_function scf
        JOIN indicator i ON i.sub_core_function_id = scf.id
        WHERE scf.core_function_id = cf.id
        AND (
          i.indicator IS NULL OR
          i.indicator_date IS NULL
        )
      ) THEN 'Missing Fields: Indicator Description or Target Date'
      WHEN NOT EXISTS (
        SELECT 1 FROM indicator i 
        WHERE i.core_function_id = cf.id
        AND i.sub_core_function_id IS NULL
        UNION
        SELECT 1 FROM sub_core_function scf
        JOIN indicator i ON i.sub_core_function_id = scf.id
        WHERE scf.core_function_id = cf.id
      ) THEN 'No Indicators Found'
    END as missing_field
  INTO invalid_function
  FROM core_function cf
  WHERE cf.ipcr_id = p_ipcr_id
  AND (
    cf.unit IS NULL OR
    cf.reviewer_id IS NULL OR
    EXISTS (
      SELECT 1 FROM indicator i 
      WHERE i.core_function_id = cf.id 
      AND i.sub_core_function_id IS NULL
      AND (
        i.indicator IS NULL OR
        i.indicator_date IS NULL
      )
    ) OR EXISTS (
      SELECT 1 FROM sub_core_function scf
      JOIN indicator i ON i.sub_core_function_id = scf.id
      WHERE scf.core_function_id = cf.id
      AND (
        i.indicator IS NULL OR
        i.indicator_date IS NULL
      )
    ) OR NOT EXISTS (
      SELECT 1 FROM indicator i 
      WHERE i.core_function_id = cf.id
      AND i.sub_core_function_id IS NULL
      UNION
      SELECT 1 FROM sub_core_function scf
      JOIN indicator i ON i.sub_core_function_id = scf.id
      WHERE scf.core_function_id = cf.id
    )
  )
  LIMIT 1;

  IF FOUND THEN
    result := (false, format('%s Function "%s": %s', 
                            invalid_function.function_type,
                            invalid_function.name,
                            invalid_function.missing_field));
    RETURN result;
  END IF;

  -- Check support functions
  SELECT 
    sf.id,
    sf.name,
    'Support' as function_type,
    CASE
      WHEN sf.unit IS NULL AND sf.reviewer_id IS NULL THEN 'Missing Fields: Unit and Reviewer'
      WHEN sf.unit IS NULL THEN 'Missing Field: Unit'
      WHEN sf.reviewer_id IS NULL THEN 'Missing Field: Reviewer'
      WHEN EXISTS (
        SELECT 1 FROM indicator i 
        WHERE i.support_function_id = sf.id
        AND i.sub_support_function_id IS NULL
        AND (
          i.indicator IS NULL OR
          i.indicator_date IS NULL
        )
      ) OR EXISTS (
        SELECT 1 FROM sub_support_function ssf
        JOIN indicator i ON i.sub_support_function_id = ssf.id
        WHERE ssf.support_function_id = sf.id
        AND (
          i.indicator IS NULL OR
          i.indicator_date IS NULL
        )
      ) THEN 'Missing Fields: Indicator Description or Target Date'
      WHEN NOT EXISTS (
        SELECT 1 FROM indicator i 
        WHERE i.support_function_id = sf.id
        AND i.sub_support_function_id IS NULL
        UNION
        SELECT 1 FROM sub_support_function ssf
        JOIN indicator i ON i.sub_support_function_id = ssf.id
        WHERE ssf.support_function_id = sf.id
      ) THEN 'No Indicators Found'
    END as missing_field
  INTO invalid_function
  FROM support_function sf
  WHERE sf.ipcr_id = p_ipcr_id
  AND (
    sf.unit IS NULL OR
    sf.reviewer_id IS NULL OR
    EXISTS (
      SELECT 1 FROM indicator i 
      WHERE i.support_function_id = sf.id 
      AND i.sub_support_function_id IS NULL
      AND (
        i.indicator IS NULL OR
        i.indicator_date IS NULL
      )
    ) OR EXISTS (
      SELECT 1 FROM sub_support_function ssf
      JOIN indicator i ON i.sub_support_function_id = ssf.id
      WHERE ssf.support_function_id = sf.id
      AND (
        i.indicator IS NULL OR
        i.indicator_date IS NULL
      )
    ) OR NOT EXISTS (
      SELECT 1 FROM indicator i 
      WHERE i.support_function_id = sf.id
      AND i.sub_support_function_id IS NULL
      UNION
      SELECT 1 FROM sub_support_function ssf
      JOIN indicator i ON i.sub_support_function_id = ssf.id
      WHERE ssf.support_function_id = sf.id
    )
  )
  LIMIT 1;

  IF FOUND THEN
    result := (false, format('%s Function "%s": %s', 
                            invalid_function.function_type,
                            invalid_function.name,
                            invalid_function.missing_field));
    RETURN result;
  END IF;

  -- Check other functions
  SELECT 
    of.id,
    of.name,
    'Other' as function_type,
    CASE
      WHEN of.unit IS NULL AND of.reviewer_id IS NULL THEN 'Missing Fields: Unit and Reviewer'
      WHEN of.unit IS NULL THEN 'Missing Field: Unit'
      WHEN of.reviewer_id IS NULL THEN 'Missing Field: Reviewer'
      WHEN EXISTS (
        SELECT 1 FROM indicator i 
        WHERE i.other_function_id = of.id
        AND i.sub_other_function_id IS NULL
        AND (
          i.indicator IS NULL OR
          i.indicator_date IS NULL
        )
      ) OR EXISTS (
        SELECT 1 FROM sub_other_function sof
        JOIN indicator i ON i.sub_other_function_id = sof.id
        WHERE sof.other_function_id = of.id
        AND (
          i.indicator IS NULL OR
          i.indicator_date IS NULL
        )
      ) THEN 'Missing Fields: Indicator Description or Target Date'
      WHEN NOT EXISTS (
        SELECT 1 FROM indicator i 
        WHERE i.other_function_id = of.id
        AND i.sub_other_function_id IS NULL
        UNION
        SELECT 1 FROM sub_other_function sof
        JOIN indicator i ON i.sub_other_function_id = sof.id
        WHERE sof.other_function_id = of.id
      ) THEN 'No Indicators Found'
    END as missing_field
  INTO invalid_function
  FROM other_function of
  WHERE of.ipcr_id = p_ipcr_id
  AND (
    of.unit IS NULL OR
    of.reviewer_id IS NULL OR
    EXISTS (
      SELECT 1 FROM indicator i 
      WHERE i.other_function_id = of.id 
      AND i.sub_other_function_id IS NULL
      AND (
        i.indicator IS NULL OR
        i.indicator_date IS NULL
      )
    ) OR EXISTS (
      SELECT 1 FROM sub_other_function sof
      JOIN indicator i ON i.sub_other_function_id = sof.id
      WHERE sof.other_function_id = of.id
      AND (
        i.indicator IS NULL OR
        i.indicator_date IS NULL
      )
    ) OR NOT EXISTS (
      SELECT 1 FROM indicator i 
      WHERE i.other_function_id = of.id
      AND i.sub_other_function_id IS NULL
      UNION
      SELECT 1 FROM sub_other_function sof
      JOIN indicator i ON i.sub_other_function_id = sof.id
      WHERE sof.other_function_id = of.id
    )
  )
  LIMIT 1;

  IF FOUND THEN
    result := (false, format('%s Function "%s": %s', 
                            invalid_function.function_type,
                            invalid_function.name,
                            invalid_function.missing_field));
    RETURN result;
  END IF;

  -- If we get here, everything is valid
  result := (true, 'IPCR is complete and valid');
  RETURN result;
END;
$$;