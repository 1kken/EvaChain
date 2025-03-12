-- First drop the existing function
DROP FUNCTION IF EXISTS get_evidence_files_by_user(UUID);

-- Then recreate the function with the correct return type
CREATE OR REPLACE FUNCTION get_evidence_files_by_user(p_accomplishment_indicator_id UUID)
RETURNS TABLE (
  uploader_id UUID,
  user_full_name TEXT,
  user_email VARCHAR(255),
  files TEXT[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.uploader_id,
    CONCAT(p.first_name, ' ', p.last_name) AS user_full_name,
    p.email AS user_email,
    ARRAY_AGG(e.file_path) AS files
  FROM 
    ipcr_indicator_evidence e
  JOIN 
    profiles p ON e.uploader_id = p.id
  WHERE 
    e.accomplishment_indicator_id = p_accomplishment_indicator_id
  GROUP BY 
    e.uploader_id, p.first_name, p.last_name, p.email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_evidence_files_by_user(UUID) TO authenticated;