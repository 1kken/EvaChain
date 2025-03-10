CREATE OR REPLACE FUNCTION tech_admin_accomplishment_performance(p_unit_id INTEGER)
RETURNS TABLE (
  office_id INTEGER,
  office_code VARCHAR,
  office_name VARCHAR,
  average_accomplishment NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id AS office_id,
    o.code AS office_code,
    o.name AS office_name,
    ROUND(AVG(ar.total_accomplishment_rate), 2) AS average_accomplishment
  FROM 
    accomplishment_report_avg_rate ar
  JOIN 
    office o ON ar.office_id = o.id
  WHERE 
    -- Only consider current year
    EXTRACT(YEAR FROM ar.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    -- Exclude offices with names starting with "Institute" or "College" (case-insensitive)
    AND o.name NOT ILIKE 'Institute%' 
    AND o.name NOT ILIKE 'College%'
    -- Filter by the provided unit_id
    AND o.unit_id = p_unit_id
  GROUP BY 
    o.id, o.code, o.name
  ORDER BY 
    average_accomplishment DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION tech_admin_accomplishment_performance(INTEGER) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION tech_admin_accomplishment_performance(INTEGER) IS 
'Calculates the average accomplishment rate by technical/administrative office for the current year, 
excluding offices with names starting with "Institute" or "College". 
Filtered by the specified unit_id parameter.';