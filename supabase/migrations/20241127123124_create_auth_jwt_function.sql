-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT SELECT ON TABLE user_roles TO supabase_auth_admin;
GRANT SELECT ON TABLE roles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION auth.jwt() TO postgres, authenticated, anon;

-- Create the JWT function
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = auth, public
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'role', roles.name,
        'role_id', roles.id
    )
    INTO result
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid();
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$;