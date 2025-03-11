-- Function 2: Get operational plans based on unit_id where creator has dean or head_of_office role
CREATE OR REPLACE FUNCTION get_operational_plans_by_unit_for_dean_or_head(p_unit_id INTEGER)
RETURNS SETOF operational_plan
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT op.* 
  FROM operational_plan op
  INNER JOIN user_roles ur ON op.creator_id = ur.user_id
  INNER JOIN roles r ON ur.role_id = r.id
  WHERE op.unit_id = p_unit_id
  AND r.name IN ('dean', 'head_of_office')
  ORDER BY op.created_at DESC;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION get_operational_plans_by_unit_for_dean_or_head(INTEGER) TO authenticated;