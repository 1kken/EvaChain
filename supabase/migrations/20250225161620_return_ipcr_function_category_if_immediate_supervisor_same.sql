CREATE OR REPLACE FUNCTION return_ipcr_function_category_if_immediate_supervisor_same(
  p_ipcr_function_id UUID,
  p_supervisor_id UUID
)
RETURNS SETOF ipcr_function_category
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT fc.*
    FROM ipcr_function_category fc
    WHERE 
      fc.ipcr_function_id = p_ipcr_function_id 
      AND fc.immediate_supervisor_id = p_supervisor_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION return_ipcr_function_category_if_immediate_supervisor_same(UUID, UUID) TO authenticated;