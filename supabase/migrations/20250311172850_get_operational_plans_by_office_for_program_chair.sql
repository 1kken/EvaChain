CREATE OR REPLACE FUNCTION get_operational_plans_by_office_for_program_chair(p_office_id INTEGER)
RETURNS SETOF operational_plan
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT op.* 
  FROM operational_plan op
  INNER JOIN user_roles ur ON op.creator_id = ur.user_id
  INNER JOIN roles r ON ur.role_id = r.id
  WHERE op.office_id = p_office_id
  AND r.name = 'program_chair'
  ORDER BY op.created_at DESC;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION get_operational_plans_by_office_for_program_chair(INTEGER) TO authenticated;