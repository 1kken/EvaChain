CREATE VIEW user_role_view AS
SELECT 
    user_roles.user_id,
    roles.name as role_name,
    roles.id as role_id
FROM user_roles
JOIN roles ON user_roles.role_id = roles.id;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TABLE (
    role_name VARCHAR,
    role_id INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        roles.name,
        roles.id
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;