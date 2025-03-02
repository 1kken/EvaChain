CREATE
OR REPLACE VIEW profile_details_view AS
SELECT
    -- Profile basic information
    p.id,
    p.employee_id,
    p.email,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.avatar_url,
    CONCAT (
        p.first_name,
        CASE
            WHEN p.middle_name IS NOT NULL
            AND p.middle_name != '' THEN ' ' || p.middle_name || ' '
            ELSE ' '
        END,
        p.last_name
    ) as full_name,
    -- Unit information
    u.id as unit_id,
    u.code as unit_code,
    u.name as unit_name,
    -- Office information
    o.id as office_id,
    o.code as office_code,
    o.name as office_name,
    -- Program information
    prog.id as program_id,
    prog.name as program_name,
    -- Nature of work information
    now.id as nature_of_work_id,
    now.type as nature_of_work_type,
    -- Position information
    pos.id as position_id,
    pos.name as position_name,
    -- Employee status information
    es.id as employee_status_id,
    es.type as employee_status_type,
    -- User role information from user_roles and roles tables
    ur.role_id,
    r.name as role_name,
    -- Timestamps
    p.created_at,
    p.updated_at
FROM
    profiles p
    LEFT JOIN unit u ON p.unit_id = u.id
    LEFT JOIN office o ON p.office_id = o.id
    LEFT JOIN program prog ON p.program_id = prog.id
    LEFT JOIN nature_of_work now ON p.nature_of_work_id = now.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN employee_status es ON p.employee_status_id = es.id
    LEFT JOIN user_roles ur ON p.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id;

-- Grant necessary permissions
GRANT
SELECT
    ON profile_details_view TO authenticated;