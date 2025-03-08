-- Function to get teaching effectiveness average by office for the current year
CREATE OR REPLACE FUNCTION get_office_teaching_effectiveness_avg()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
BEGIN
    -- Query to get teaching effectiveness average by office
    WITH office_avg_data AS (
        SELECT 
            o.code AS office_code,
            ROUND(AVG(COALESCE(i.teaching_effectiveness_avg, 0)), 2) AS office_teaching_effectiveness_avg
        FROM 
            office o
        LEFT JOIN ipcr_teaching_effectiveness_avg i ON o.id = i.office_id
        WHERE 
            EXTRACT(YEAR FROM i.created_at) = current_year
        GROUP BY 
            o.id, o.code
    )
    -- Convert the result set to a JSONB array
    SELECT 
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'office_code', office_code,
                    'office_teaching_effectiveness_avg', office_teaching_effectiveness_avg
                )
            ), 
            '[]'::jsonb
        ) INTO result
    FROM 
        office_avg_data;

    -- Return empty array if no results
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_office_teaching_effectiveness_avg() TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION get_office_teaching_effectiveness_avg() IS 'Aggregates teaching effectiveness averages by office for the current year. Returns a JSON array with office_code and office_teaching_effectiveness_avg for each office.';