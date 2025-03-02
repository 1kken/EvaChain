-- UNIT CREATE OPLAN  
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
            name = 'head_of_operating_unit'
    ),
    -- Get permission ID for 'unit_view_ipcr'
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'unit_create_operational_plan'
    ),
    'unit' ON CONFLICT (role_id, permission_id) DO NOTHING;

-- OFFICE CREATE OPLAN 
INSERT INTO
    role_permissions (role_id, permission_id, scope)
SELECT
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'head_of_office'
    ),
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'office_create_operational_plan'
    ),
    'office' ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO
    role_permissions (role_id, permission_id, scope)
SELECT
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'dean'
    ),
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'office_create_operational_plan'
    ),
    'office' ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO
    role_permissions (role_id, permission_id, scope)
SELECT
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'program_chair'
    ),
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'program_create_operational_plan'
    ),
    'program' ON CONFLICT (role_id, permission_id) DO NOTHING;