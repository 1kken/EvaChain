CREATE
OR REPLACE VIEW operational_backup_view AS
SELECT
    -- Operational Plan details
    op.id as operational_plan_id,
    op.title as operational_plan_title,
    op.implementing_unit,
    op.review_by,
    op.reviewer_position,
    op.approve_by,
    op.approver_position,
    -- Creator Profile details
    p.id as creator_id,
    p.employee_id as creator_employee_id,
    p.first_name as creator_first_name,
    p.middle_name as creator_middle_name,
    p.last_name as creator_last_name,
    p.email as creator_email,
    -- Creator's Position details
    pos.name as creator_position_name,
    now_type.type as creator_nature_of_work,
    emp_status.type as creator_employee_status,
    -- Creator's Unit details
    creator_unit.code as creator_unit_code,
    creator_unit.name as creator_unit_name,
    -- Creator's Office details
    creator_office.code as creator_office_code,
    creator_office.name as creator_office_name,
    -- Creator's Program details
    creator_program.name as creator_program_name,
    -- Operational Plan Unit details
    op_unit.code as op_unit_code,
    op_unit.name as op_unit_name,
    -- Operational Plan Office details
    op_office.code as op_office_code,
    op_office.name as op_office_name,
    -- Operational Plan Program details
    op_program.name as op_program_name,
    -- Header details
    h.id as header_id,
    h.title as header_title,
    h.position as header_position,
    -- Annual Plan details
    ap.id as annual_plan_id,
    ap.description as annual_plan_description,
    ap.position as annual_plan_position,
    -- Activity details
    act.id as activity_id,
    act.activity,
    act.position as activity_position,
    -- Indicator details
    ind.id as indicator_id,
    ind.input_type,
    ind.performance_indicator,
    ind.former_state,
    ind.q1_target,
    ind.q2_target,
    ind.q3_target,
    ind.q4_target,
    ind.total,
    ind.responsible_officer_unit,
    ind.total_budgetary_requirements,
    ind.position as indicator_position,
    -- Timestamps
    op.created_at,
    op.updated_at,
    act.created_at as activity_created_at,
    act.updated_at as activity_updated_at,
    ind.created_at as indicator_created_at,
    ind.updated_at as indicator_updated_at
FROM
    operational_plan op
    -- Creator joins
    LEFT JOIN profiles p ON op.creator_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit creator_unit ON p.unit_id = creator_unit.id
    LEFT JOIN office creator_office ON p.office_id = creator_office.id
    LEFT JOIN program creator_program ON p.program_id = creator_program.id
    -- Operational Plan entity joins
    LEFT JOIN unit op_unit ON op.unit_id = op_unit.id
    LEFT JOIN office op_office ON op.office_id = op_office.id
    LEFT JOIN program op_program ON op.program_id = op_program.id
    -- Operational Plan hierarchy joins
    LEFT JOIN op_header h ON op.id = h.operational_plan_id
    LEFT JOIN op_annual_plan ap ON h.id = ap.op_header_id
    LEFT JOIN op_activity act ON ap.id = act.op_annual_plan_id
    LEFT JOIN op_activity_indicator ind ON act.id = ind.op_activity_id;

-- Grant SELECT permission to authenticated users
GRANT
SELECT
    ON operational_backup_view TO authenticated;