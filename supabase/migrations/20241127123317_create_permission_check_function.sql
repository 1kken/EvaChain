CREATE OR REPLACE FUNCTION check_permission(
    required_permission VARCHAR,
    target_office_id INTEGER DEFAULT NULL,
    target_unit_id INTEGER DEFAULT NULL,
    target_program_id INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    user_permission_scope scope_type;
    user_assigned_office_id INTEGER;
    user_assigned_unit_id INTEGER;
    user_assigned_program_id INTEGER;
    permission_exists BOOLEAN;
BEGIN
    -- Get user's scope and IDs
    SELECT 
        role_permission.scope,
        profile.office_id,
        profile.unit_id,
        profile.program_id,
        EXISTS (
            SELECT 1 
            FROM role_permissions role_permission_check
            JOIN permissions permission ON permission.id = role_permission_check.permission_id
            WHERE role_permission_check.role_id = (auth.jwt()->>'role_id')::integer 
            AND permission.name = required_permission
        )
    INTO 
        user_permission_scope,
        user_assigned_office_id,
        user_assigned_unit_id,
        user_assigned_program_id,
        permission_exists
    FROM profiles profile
    JOIN user_roles user_role ON profile.id = user_role.user_id
    JOIN role_permissions role_permission ON user_role.role_id = role_permission.role_id
    JOIN permissions permission ON role_permission.permission_id = permission.id
    WHERE profile.id = auth.uid()
    AND permission.name = required_permission;

    -- No permission found
    IF NOT permission_exists THEN
        RETURN FALSE;
    END IF;

    -- Check scope access from highest (all) to lowest (unit)
    RETURN CASE
        -- All level (highest scope)
        WHEN user_permission_scope = 'all' THEN 
            TRUE
            
        -- Program level
        WHEN user_permission_scope = 'program' THEN 
            target_program_id IS NULL OR target_program_id = user_assigned_program_id
            
        -- Office level
        WHEN user_permission_scope = 'office' THEN 
            target_office_id IS NULL OR target_office_id = user_assigned_office_id
            
        -- Unit level (lowest scope)
        WHEN user_permission_scope = 'unit' THEN 
            target_unit_id IS NULL OR target_unit_id = user_assigned_unit_id
            
        -- Default case
        ELSE 
            FALSE
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;