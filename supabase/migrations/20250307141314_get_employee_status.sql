CREATE OR REPLACE FUNCTION get_employee_status_count(
  p_unit_id INTEGER DEFAULT NULL,
  p_office_id INTEGER DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN

  -- Query to count employees by status
  WITH status_counts AS (
    SELECT 
      es.type AS status_type,
      COUNT(p.id) AS count
    FROM 
      profiles p
    JOIN 
      employee_status es ON p.employee_status_id = es.id
    WHERE
      (p_unit_id IS NULL OR p.unit_id = p_unit_id) AND
      (p_office_id IS NULL OR p.office_id = p_office_id)
    GROUP BY 
      es.type
  )
  
  -- Convert the result to a JSONB object
  SELECT 
    jsonb_object_agg(status_type, count)
  INTO 
    result
  FROM 
    status_counts;

  -- Return empty JSON if no results
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_employee_status_count(INTEGER, INTEGER) TO authenticated;

-- Add function comment
COMMENT ON FUNCTION get_employee_status_count(INTEGER, INTEGER) IS 
  'Aggregates employee counts by status type for a specified unit or office. If both parameters are NULL, returns counts for the entire organization. Returns a JSON object with status types as keys and counts as values.';