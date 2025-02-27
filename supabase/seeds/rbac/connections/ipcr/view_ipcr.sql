-- UNIT VIEW IPCR
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
            name = 'unit_view_ipcr'
    ),
    'unit' ON CONFLICT (role_id, permission_id) DO NOTHING;

-- OFFICE VIEW IPCR
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
            name = 'office_view_ipcr'
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
            name = 'office_view_ipcr'
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
            name = 'program_view_ipcr'
    ),
    'program' ON CONFLICT (role_id, permission_id) DO NOTHING;