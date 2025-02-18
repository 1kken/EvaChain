CREATE
OR REPLACE VIEW ipcr_backup_view AS
SELECT
    i.id as ipcr_id,
    i.title as ipcr_title,
    i.status as ipcr_status,
    i.head_of_operating_unit,
    i.immediate_supervisor,
    i.immediate_supervisor_position,
    i.program_chair,
    i.dean,
    -- Owner details
    p.id as owner_id,
    p.employee_id as owner_employee_id,
    p.first_name as owner_first_name,
    p.middle_name as owner_middle_name,
    p.last_name as owner_last_name,
    p.email as owner_email,
    pos.name as owner_position_name,
    now_type.type as owner_nature_of_work,
    emp_status.type as owner_employee_status,
    -- Owner organization
    owner_unit.id as owner_unit_id,
    owner_unit.code as owner_unit_code,
    owner_unit.name as owner_unit_name,
    owner_office.id as owner_office_id,
    owner_office.code as owner_office_code,
    owner_office.name as owner_office_name,
    owner_program.id as owner_program_id,
    owner_program.name as owner_program_name,
    -- IPCR organization
    ipcr_unit.id as ipcr_unit_id,
    ipcr_unit.code as ipcr_unit_code,
    ipcr_unit.name as ipcr_unit_name,
    ipcr_office.id as ipcr_office_id,
    ipcr_office.code as ipcr_office_code,
    ipcr_office.name as ipcr_office_name,
    ipcr_program.id as ipcr_program_id,
    ipcr_program.name as ipcr_program_name,
    -- Function details
    f.id as function_id,
    f.title as function_title,
    f.percentage as function_percentage,
    f.position as function_position,
    -- Category details
    fc.id as category_id,
    fc.category,
    fc.unit as category_unit,
    fc.position as category_position,
    cat_sup_profile.employee_id as category_supervisor_employee_id,
    cat_sup_profile.first_name as category_supervisor_first_name,
    cat_sup_profile.middle_name as category_supervisor_middle_name,
    cat_sup_profile.last_name as category_supervisor_last_name,
    cat_sup_pos.name as category_supervisor_position,
    -- Subcategory details
    fsc.id as subcategory_id,
    fsc.sub_category,
    fsc.position as subcategory_position,
    -- Indicator details
    ind.id as indicator_id,
    ind.final_output,
    ind.success_indicator,
    ind.units as indicator_units,
    ind.quality_rating,
    ind.efficiency_rating,
    ind.timeliness_rating,
    ind.average_rating,
    ind.remarks as indicator_remarks,
    ind.position as indicator_position,
    -- Accomplishment details
    ia.id as accomplishment_id,
    ia.actual_accomplishments,
    ia.accomplishment_date,
    ia.quantity,
    -- Indicator supervisor details
    ind_sup_profile.employee_id as indicator_supervisor_employee_id,
    ind_sup_profile.first_name as indicator_supervisor_first_name,
    ind_sup_profile.middle_name as indicator_supervisor_middle_name,
    ind_sup_profile.last_name as indicator_supervisor_last_name,
    ind_sup_pos.name as indicator_supervisor_position,
    -- Operational plan details
    op_act.activity as op_activity,
    op_ind.performance_indicator as op_performance_indicator,
    op_ind.input_type as op_input_type,
    op_ind.former_state as op_former_state,
    op_ind.q1_target as op_q1_target,
    op_ind.q2_target as op_q2_target,
    op_ind.q3_target as op_q3_target,
    op_ind.q4_target as op_q4_target,
    op_ind.total as op_total,
    op_ind.responsible_officer_unit as op_responsible_officer_unit,
    op_ind.total_budgetary_requirements as op_total_budgetary_requirements,
    -- Evidence files with inner join to ensure only valid accomplishments
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
            JOIN ipcr_indicator_accomplishment ia2 ON e.ipcr_indicator_accomplishment_id = ia2.id
        WHERE
            ia2.ipcr_indicator_id = ind.id
    ) as evidence_files,
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
    LEFT JOIN program owner_program ON p.program_id = owner_program.id
    LEFT JOIN unit ipcr_unit ON i.unit_id = ipcr_unit.id
    LEFT JOIN office ipcr_office ON i.office_id = ipcr_office.id
    LEFT JOIN program ipcr_program ON i.program_id = ipcr_program.id
    LEFT JOIN ipcr_function f ON i.id = f.ipcr_id
    LEFT JOIN ipcr_function_category fc ON f.id = fc.ipcr_function_id
    LEFT JOIN ipcr_function_sub_category fsc ON fc.id = fsc.ipcr_function_category_id
    LEFT JOIN profiles cat_sup_profile ON fc.immediate_supervisor_id = cat_sup_profile.id
    LEFT JOIN position cat_sup_pos ON cat_sup_profile.position_id = cat_sup_pos.id
    LEFT JOIN ipcr_indicator ind ON (
        ind.ipcr_function_id = f.id
        OR ind.ipcr_function_category_id = fc.id
        OR ind.ipcr_function_sub_category_id = fsc.id
    )
    LEFT JOIN ipcr_indicator_accomplishment ia ON ind.id = ia.ipcr_indicator_id
    LEFT JOIN profiles ind_sup_profile ON ind.immediate_supervisor_id = ind_sup_profile.id
    LEFT JOIN position ind_sup_pos ON ind_sup_profile.position_id = ind_sup_pos.id
    LEFT JOIN op_activity_indicator op_ind ON ind.op_activity_indicator_id = op_ind.id
    LEFT JOIN op_activity op_act ON op_ind.op_activity_id = op_act.id;

-- Grant select permission
GRANT
SELECT
    ON ipcr_backup_view TO authenticated;