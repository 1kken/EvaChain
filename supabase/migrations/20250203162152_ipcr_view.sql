CREATE
OR REPLACE VIEW ipcr_backup_view AS
SELECT
    -- IPCR Basic Details
    i.id as ipcr_id,
    i.title as ipcr_title,
    i.status as ipcr_status,
    i.head_of_operating_unit,
    i.program_chair,
    i.dean,
    -- Owner Profile Details
    p.id as owner_id,
    p.employee_id as owner_employee_id,
    p.first_name as owner_first_name,
    p.middle_name as owner_middle_name,
    p.last_name as owner_last_name,
    p.email as owner_email,
    -- Owner Position Details
    pos.name as owner_position_name,
    now_type.type as owner_nature_of_work,
    emp_status.type as owner_employee_status,
    -- Owner Unit Details
    owner_unit.id as owner_unit_id,
    owner_unit.code as owner_unit_code,
    owner_unit.name as owner_unit_name,
    -- Owner Office Details
    owner_office.id as owner_office_id,
    owner_office.code as owner_office_code,
    owner_office.name as owner_office_name,
    -- Owner Program Details
    owner_program.id as owner_program_id,
    owner_program.name as owner_program_name,
    -- IPCR Organization Details
    ipcr_unit.id as ipcr_unit_id,
    ipcr_unit.code as ipcr_unit_code,
    ipcr_unit.name as ipcr_unit_name,
    ipcr_office.id as ipcr_office_id,
    ipcr_office.code as ipcr_office_code,
    ipcr_office.name as ipcr_office_name,
    ipcr_program.id as ipcr_program_id,
    ipcr_program.name as ipcr_program_name,
    -- Function Details
    f.id as function_id,
    f.title as function_title,
    f.percentage as function_percentage,
    f.position as function_position,
    -- Category Details
    fc.id as category_id,
    fc.category,
    fc.unit as category_unit,
    fc.position as category_position,
    -- Category Supervisor Details
    cat_sup_profile.employee_id as category_supervisor_employee_id,
    cat_sup_profile.first_name as category_supervisor_first_name,
    cat_sup_profile.middle_name as category_supervisor_middle_name,
    cat_sup_profile.last_name as category_supervisor_last_name,
    cat_sup_pos.name as category_supervisor_position,
    -- Sub Category Details
    fsc.id as subcategory_id,
    fsc.sub_category,
    fsc.position as subcategory_position,
    -- Indicator Details
    ind.id as indicator_id,
    ind.final_output,
    ind.success_indicator,
    ind.actual_accomplishments,
    ind.accomplishment_date,
    ind.quality_rating,
    ind.efficiency_rating,
    ind.timeliness_rating,
    ind.average_rating,
    ind.remarks,
    ind.units as indicator_units,
    ind.position as indicator_position,
    -- Indicator Supervisor Details
    ind_sup_profile.employee_id as indicator_supervisor_employee_id,
    ind_sup_profile.first_name as indicator_supervisor_first_name,
    ind_sup_profile.middle_name as indicator_supervisor_middle_name,
    ind_sup_profile.last_name as indicator_supervisor_last_name,
    ind_sup_pos.name as indicator_supervisor_position,
    -- Operational Plan Activity Details
    op_act.activity as op_activity,
    op_act.performance_indicator as op_performance_indicator,
    op_act.responsible_officer_unit as op_responsible_officer_unit,
    -- Evidence Details
    (
        SELECT
            json_agg (
                json_build_object (
                    'id',
                    e.id,
                    'file_path',
                    e.file_path,
                    'created_at',
                    e.created_at
                )
            )
        FROM
            ipcr_indicator_evidence e
        WHERE
            e.ipcr_indicator_id = ind.id
    ) as evidence_files,
    -- Timestamps
    i.created_at,
    i.updated_at
FROM
    ipcr i
    -- Owner joins
    LEFT JOIN profiles p ON i.owner_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit owner_unit ON p.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON p.office_id = owner_office.id
    LEFT JOIN program owner_program ON p.program_id = owner_program.id
    -- IPCR Organization joins
    LEFT JOIN unit ipcr_unit ON i.unit_id = ipcr_unit.id
    LEFT JOIN office ipcr_office ON i.office_id = ipcr_office.id
    LEFT JOIN program ipcr_program ON i.program_id = ipcr_program.id
    -- IPCR hierarchy joins
    LEFT JOIN ipcr_function f ON i.id = f.ipcr_id
    LEFT JOIN ipcr_function_category fc ON f.id = fc.ipcr_function_id
    LEFT JOIN ipcr_function_sub_category fsc ON fc.id = fsc.ipcr_function_category_id
    -- Category supervisor joins
    LEFT JOIN profiles cat_sup_profile ON fc.immediate_supervisor_id = cat_sup_profile.id
    LEFT JOIN position cat_sup_pos ON cat_sup_profile.position_id = cat_sup_pos.id
    -- Indicator joins and its supervisor
    LEFT JOIN ipcr_indicator ind ON (
        ind.ipcr_function_id = f.id
        OR ind.ipcr_function_category_id = fc.id
        OR ind.ipcr_function_sub_category_id = fsc.id
    )
    LEFT JOIN profiles ind_sup_profile ON ind.immediate_supervisor_id = ind_sup_profile.id
    LEFT JOIN position ind_sup_pos ON ind_sup_profile.position_id = ind_sup_pos.id
    -- Operational plan activity join
    LEFT JOIN op_activity op_act ON ind.op_activity_id = op_act.id;

-- Grant SELECT permission to authenticated users
GRANT
SELECT
    ON ipcr_backup_view TO authenticated;