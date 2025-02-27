CREATE
OR REPLACE VIEW ipcr_owner_details AS
SELECT
    i.id as ipcr_id,
    i.title as ipcr_title,
    i.status as ipcr_status,
    -- Owner basic details
    p.id as owner_id,
    p.employee_id,
    CONCAT (
        p.first_name,
        CASE
            WHEN p.middle_name IS NOT NULL
            AND p.middle_name != '' THEN ' ' || p.middle_name || ' '
            ELSE ' '
        END,
        p.last_name
    ) as full_name,
    p.email,
    -- Position and work details
    pos.name as position_name,
    now_type.id as nature_of_work_id,
    now_type.type as nature_of_work,
    emp_status.id as employee_status_id,
    emp_status.type as employee_status,
    -- Organizational details
    owner_unit.id as unit_id,
    owner_unit.code as unit_code,
    owner_unit.name as unit_name,
    owner_office.id as office_id,
    owner_office.code as office_code,
    owner_office.name as office_name,
    owner_program.id as program_id,
    owner_program.name as program_name,
    -- IPCR creation/update info
    i.created_at,
    i.updated_at
FROM
    ipcr i
    LEFT JOIN profiles p ON i.owner_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit owner_unit ON p.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON p.office_id = owner_office.id
    LEFT JOIN program owner_program ON p.program_id = owner_program.id;

-- Grant select permission to authenticated users
GRANT
SELECT
    ON ipcr_owner_details TO authenticated;