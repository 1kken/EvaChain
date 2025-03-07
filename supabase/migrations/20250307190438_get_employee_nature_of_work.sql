CREATE OR REPLACE FUNCTION get_employee_nature_of_work(
  p_unit_id INTEGER
) RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Query to count employees by nature of work
  WITH nature_counts AS (
    SELECT 
      now.type AS nature_type,
      COUNT(p.id) AS count
    FROM profiles p
    JOIN nature_of_work now ON p.nature_of_work_id = now.id
    WHERE p.unit_id = p_unit_id
    GROUP BY now.type
  )
  
  -- Convert the result to a JSONB object
  SELECT jsonb_object_agg(nature_type, count) INTO result
  FROM nature_counts;
  
  -- Return empty JSON if no results
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_employee_nature_of_work(INTEGER) TO authenticated;

-- Add function comment
COMMENT ON FUNCTION get_employee_nature_of_work(INTEGER) IS 'Aggregates employee counts by nature of work type for a specified unit. Returns a JSON object with nature of work types as keys and counts as values.';