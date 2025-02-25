CREATE OR REPLACE FUNCTION return_ipcr_indicator_if_immediate_supervisor_same(
  p_ipcr_function_id UUID,
  p_supervisor_id UUID
)
RETURNS SETOF ipcr_indicator
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT i.*
    FROM ipcr_indicator i
    WHERE 
      -- Direct indicators under the function with matching supervisor
      i.ipcr_function_id = p_ipcr_function_id 
      AND i.immediate_supervisor_id = p_supervisor_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION return_ipcr_indicator_if_immediate_supervisor_same(UUID, UUID) TO authenticated;