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
            name = 'create_accomplishment_report'
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
            name = 'create_accomplishment_report'
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
            name = 'create_accomplishment_report'
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
            name = 'create_accomplishment_report'
    ),
    'program' ON CONFLICT (role_id, permission_id) DO NOTHING;

-- OFFICE CREATE OPLAN  VICE-PRESIDENT
INSERT INTO
    role_permissions (role_id, permission_id, scope)
SELECT
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'vice-president'
    ),
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'create_accomplishment_report'
    ),
    'office' ON CONFLICT (role_id, permission_id) DO NOTHING;

-- OFFICE CREATE OPLAN  VICE-PRESIDENT
INSERT INTO
    role_permissions (role_id, permission_id, scope)
SELECT
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'director'
    ),
    (
        SELECT
            id
        FROM
            permissions
        WHERE
            name = 'create_accomplishment_report'
    ),
    'office' ON CONFLICT (role_id, permission_id) DO NOTHING;