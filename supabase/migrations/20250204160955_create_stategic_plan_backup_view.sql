CREATE
OR REPLACE VIEW strategic_plan_backup_view AS
SELECT
    -- Strategic Plan Basic Details
    sp.id as strategic_plan_id,
    sp.title as strategic_plan_title,
    sp.major_output,
    sp.goal,
    sp.start_year,
    sp.end_year,
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
    -- Strategic Plan Organization Details
    sp_unit.id as sp_unit_id,
    sp_unit.code as sp_unit_code,
    sp_unit.name as sp_unit_name,
    sp_office.id as sp_office_id,
    sp_office.code as sp_office_code,
    sp_office.name as sp_office_name,
    sp_program.id as sp_program_id,
    sp_program.name as sp_program_name,
    -- Objective Details
    obj.id as objective_id,
    obj.objective,
    obj.position as objective_position,
    -- Strategy Details
    strat.id as strategy_id,
    strat.description as strategy_description,
    strat.position as strategy_position,
    -- Performance Indicator Details
    pi.id as performance_indicator_id,
    pi.performance_indicator,
    pi.input_type,
    pi.base_target,
    pi.actual_target,
    pi.concerned_offices,
    pi.remarks as pi_remarks,
    pi.position as pi_position,
    -- Yearly Plan Details
    (
        SELECT
            json_agg (
                json_build_object (
                    'id',
                    yp.id,
                    'year',
                    yp.year,
                    'target',
                    yp.target,
                    'budget',
                    yp.budget
                )
                ORDER BY
                    yp.year
            )
        FROM
            strat_plan_yearly_plan yp
        WHERE
            yp.strategy_plan_performance_indicator_id = pi.id
    ) as yearly_plans,
    -- SDG Alignment Details
    (
        SELECT
            json_agg (
                json_build_object (
                    'alignment_id',
                    sa.id,
                    'objective_id',
                    sa.strat_plan_objective_id,
                    'performance_indicator_id',
                    sa.strat_plan_performance_indicator_id
                )
            )
        FROM
            sdg_alignment sa
        WHERE
            sa.strat_plan_objective_id = obj.id
    ) as sdg_alignments,
    -- Related OPCR Details (if any)
    (
        SELECT
            json_agg (
                json_build_object (
                    'opcr_id',
                    o.id,
                    'title',
                    o.title,
                    'review_by',
                    o.review_by,
                    'reviewer_position',
                    o.reviewer_position
                )
            )
        FROM
            opcr o
        WHERE
            o.unit_id = sp.unit_id
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
    ) as related_opcrs,
    -- Timestamps
    sp.created_at,
    sp.updated_at
FROM
    strategic_plan sp
    -- Owner joins
    LEFT JOIN profiles p ON sp.owner_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit owner_unit ON p.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON p.office_id = owner_office.id
    LEFT JOIN program owner_program ON p.program_id = owner_program.id
    -- Strategic Plan Organization joins
    LEFT JOIN unit sp_unit ON sp.unit_id = sp_unit.id
    LEFT JOIN office sp_office ON sp.office_id = sp_office.id
    LEFT JOIN program sp_program ON sp.program_id = sp_program.id
    -- Strategic Plan hierarchy joins
    LEFT JOIN strat_plan_objective obj ON sp.id = obj.strategic_plan_id
    LEFT JOIN strategy_plan strat ON sp.id = strat.strat_plan_id
    LEFT JOIN strategy_plan_performance_indicator pi ON strat.id = pi.strategy_plan_id;

-- Grant SELECT permission to authenticated users
GRANT
SELECT
    ON strategic_plan_backup_view TO authenticated;