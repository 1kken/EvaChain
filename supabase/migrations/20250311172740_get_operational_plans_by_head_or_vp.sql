CREATE OR REPLACE FUNCTION get_operational_plans_by_head_or_vp()
RETURNS SETOF operational_plan
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT op.* 
  FROM operational_plan op
  INNER JOIN user_roles ur ON op.creator_id = ur.user_id
  INNER JOIN roles r ON ur.role_id = r.id
  WHERE r.name IN ('head_of_operating_unit', 'vice-president')
  ORDER BY op.created_at DESC;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION get_operational_plans_by_head_or_vp() TO authenticated;