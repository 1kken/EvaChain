CREATE
OR REPLACE VIEW opcr_backup_view AS
SELECT
    -- OPCR Basic Details
    o.id as opcr_id,
    o.title as opcr_title,
    o.review_by,
    o.reviewer_position,
    o.administrative_officer,
    o.planning_officer,
    o.human_resource,
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
    -- OPCR Organization Details
    opcr_unit.id as opcr_unit_id,
    opcr_unit.code as opcr_unit_code,
    opcr_unit.name as opcr_unit_name,
    opcr_office.id as opcr_office_id,
    opcr_office.code as opcr_office_code,
    opcr_office.name as opcr_office_name,
    opcr_program.id as opcr_program_id,
    opcr_program.name as opcr_program_name,
    -- Function Details
    f.id as function_id,
    f.title as function_title,
    f.position as function_position,
    -- Category Details
    fc.id as category_id,
    fc.category,
    fc.position as category_position,
    -- Indicator Details
    ind.id as indicator_id,
    ind.success_indicator,
    ind.alloted_budget,
    ind.division_individuals_accountable,
    ind.actual_accomplishments,
    ind.quality_rating,
    ind.efficiency_rating,
    ind.timeliness_rating,
    ind.average_rating,
    ind.remarks,
    ind.position as indicator_position,
    -- Strategic Plan Alignment Details
    sp.id as strategic_plan_id,
    sp.title as strategic_plan_title,
    sp.major_output as strategic_plan_major_output,
    sp.goal as strategic_plan_goal,
    sp.start_year as strategic_plan_start_year,
    sp.end_year as strategic_plan_end_year,
    -- Timestamps
    o.created_at,
    o.updated_at
FROM
    opcr o
    -- Owner joins
    LEFT JOIN profiles p ON o.owner_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit owner_unit ON p.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON p.office_id = owner_office.id
    LEFT JOIN program owner_program ON p.program_id = owner_program.id
    -- OPCR Organization joins
    LEFT JOIN unit opcr_unit ON o.unit_id = opcr_unit.id
    LEFT JOIN office opcr_office ON o.office_id = opcr_office.id
    LEFT JOIN program opcr_program ON o.program_id = opcr_program.id
    -- OPCR hierarchy joins
    LEFT JOIN opcr_function f ON o.id = f.opcr_id
    LEFT JOIN opcr_function_category fc ON f.id = fc.opcr_function_id
    LEFT JOIN opcr_indicator ind ON (
        ind.opcr_function_id = f.id
        OR ind.opcr_function_category_id = fc.id
    )
    -- Strategic Plan join (assuming there might be a relation to strategic plan in the future)
    LEFT JOIN strategic_plan sp ON (
        (o.unit_id = sp.unit_id)
        AND (
            o.office_id IS NULL
            OR o.office_id = sp.office_id
        )
        AND (
            o.program_id IS NULL
            OR o.program_id = sp.program_id
        )
        AND (
            EXTRACT(
                YEAR
                FROM
                    o.created_at
            ) BETWEEN sp.start_year AND sp.end_year
        )
    );

-- Grant SELECT permission to authenticated users
GRANT
SELECT
    ON opcr_backup_view TO authenticated;