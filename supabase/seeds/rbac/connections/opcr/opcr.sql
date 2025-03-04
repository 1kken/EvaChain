-- UNIT STRAT OPLAN  
INSERT INTO
    role_permissions (role_id, permission_id, scope)
SELECT
    -- Get role ID for 'head_of_operating_unit'
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'president'
    ),
    -- Get permission ID for 'unit_view_ipcr'
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'create_opcr'
    ),
    'unit' ON CONFLICT (role_id, permission_id) DO NOTHING;