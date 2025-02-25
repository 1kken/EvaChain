CREATE OR REPLACE FUNCTION get_ipcr_functions_by_supervisor(
  p_ipcr_id UUID,
  p_supervisor_id UUID
)
RETURNS SETOF ipcr_function
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT f.*
    FROM ipcr_function f
    WHERE 
      f.ipcr_id = p_ipcr_id
      AND (
        -- Check categories with this supervisor
        EXISTS (
          SELECT 1
          FROM ipcr_function_category fc
          WHERE fc.ipcr_function_id = f.id
            AND fc.immediate_supervisor_id = p_supervisor_id
        )
        -- Check indicators linked directly to functions with this supervisor
        OR EXISTS (
          SELECT 1
          FROM ipcr_indicator i
          WHERE i.ipcr_function_id = f.id
            AND i.immediate_supervisor_id = p_supervisor_id
        )
      );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_ipcr_functions_by_supervisor(UUID, UUID) TO authenticated;