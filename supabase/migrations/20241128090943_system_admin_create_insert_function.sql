-- Create function to check if user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_name VARCHAR;
BEGIN
    -- Get the role name from the JWT
    SELECT (auth.jwt()->>'role')::VARCHAR INTO user_role_name;
    
    -- Check if user has system_admin role
    RETURN user_role_name = 'system_admin';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_system_admin() TO authenticated;