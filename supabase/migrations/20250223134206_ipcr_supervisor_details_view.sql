CREATE
OR REPLACE VIEW ipcr_supervisor_details_view AS
SELECT
    -- IPCR Supervisor relationship details
    is_sup.id as supervisor_relationship_id,
    is_sup.status as supervisor_review_status,
    is_sup.created_at as supervisor_assignment_date,
    -- IPCR basic details
    i.id as ipcr_id,
    i.title as ipcr_title,
    i.status as ipcr_status,
    -- IPCR Owner details
    i.owner_id,
    CONCAT (
        owner_profile.first_name,
        CASE
            WHEN owner_profile.middle_name IS NOT NULL
            AND owner_profile.middle_name != '' THEN ' ' || owner_profile.middle_name || ' '
            ELSE ' '
        END,
        owner_profile.last_name
    ) as owner_full_name,
    owner_profile.employee_id as owner_employee_id,
    owner_profile.email as owner_email,
    -- Owner's position and status
    owner_pos.name as owner_position,
    owner_now.type as owner_nature_of_work,
    owner_emp_status.type as owner_employment_status,
    -- Owner's organizational details
    owner_unit.code as owner_unit_code,
    owner_unit.name as owner_unit_name,
    owner_office.code as owner_office_code,
    owner_office.name as owner_office_name,
    owner_program.name as owner_program_name,
    -- Supervisor details
    is_sup.supervisor_id,
    CONCAT (
        sup_profile.first_name,
        CASE
            WHEN sup_profile.middle_name IS NOT NULL
            AND sup_profile.middle_name != '' THEN ' ' || sup_profile.middle_name || ' '
            ELSE ' '
        END,
        sup_profile.last_name
    ) as supervisor_full_name,
    sup_profile.employee_id as supervisor_employee_id,
    sup_profile.email as supervisor_email,
    sup_pos.name as supervisor_position,
    -- IPCR review hierarchy details
    i.immediate_supervisor as designated_supervisor_name,
    i.immediate_supervisor_position as designated_supervisor_position,
    i.program_chair,
    i.dean
FROM
    ipcr_immediate_supervisor is_sup
    JOIN ipcr i ON i.id = is_sup.ipcr_id
    -- Owner joins
    LEFT JOIN profiles owner_profile ON i.owner_id = owner_profile.id
    LEFT JOIN position owner_pos ON owner_profile.position_id = owner_pos.id
    LEFT JOIN nature_of_work owner_now ON owner_profile.nature_of_work_id = owner_now.id
    LEFT JOIN employee_status owner_emp_status ON owner_profile.employee_status_id = owner_emp_status.id
    LEFT JOIN unit owner_unit ON owner_profile.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON owner_profile.office_id = owner_office.id
    LEFT JOIN program owner_program ON owner_profile.program_id = owner_program.id
    -- Supervisor joins
    LEFT JOIN profiles sup_profile ON is_sup.supervisor_id = sup_profile.id
    LEFT JOIN position sup_pos ON sup_profile.position_id = sup_pos.id;

-- Grant necessary permissions
GRANT
SELECT
    ON ipcr_supervisor_details_view TO authenticated;