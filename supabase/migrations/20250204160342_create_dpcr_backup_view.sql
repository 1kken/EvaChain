CREATE
OR REPLACE VIEW dpcr_backup_view AS
WITH
    grouped_assessors AS (
        SELECT
            dpcr_id,
            json_agg (
                json_build_object (
                    'id',
                    id,
                    'name',
                    name,
                    'position',
                    position,
                    'sequence',
                    sequence
                )
                ORDER BY
                    sequence
            ) as assessors
        FROM
            dpcr_assessor
        GROUP BY
            dpcr_id
    )
SELECT
    -- DPCR Basic Details
    d.id as dpcr_id,
    d.title as dpcr_title,
    d.review_by,
    d.reviewer_position,
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
    -- DPCR Organization Details
    dpcr_unit.id as dpcr_unit_id,
    dpcr_unit.code as dpcr_unit_code,
    dpcr_unit.name as dpcr_unit_name,
    dpcr_office.id as dpcr_office_id,
    dpcr_office.code as dpcr_office_code,
    dpcr_office.name as dpcr_office_name,
    dpcr_program.id as dpcr_program_id,
    dpcr_program.name as dpcr_program_name,
    -- Assessor Details as JSON array
    ga.assessors,
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
    ind.physical_targets,
    ind.actual_accomplishments,
    ind.quality_rating,
    ind.efficiency_rating,
    ind.timeliness_rating,
    ind.average_rating,
    ind.remarks,
    ind.position as indicator_position,
    -- Timestamps
    d.created_at,
    d.updated_at
FROM
    dpcr d
    -- Owner joins
    LEFT JOIN profiles p ON d.owner_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit owner_unit ON p.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON p.office_id = owner_office.id
    LEFT JOIN program owner_program ON p.program_id = owner_program.id
    -- DPCR Organization joins
    LEFT JOIN unit dpcr_unit ON d.unit_id = dpcr_unit.id
    LEFT JOIN office dpcr_office ON d.office_id = dpcr_office.id
    LEFT JOIN program dpcr_program ON d.program_id = dpcr_program.id
    -- Assessors join
    LEFT JOIN grouped_assessors ga ON d.id = ga.dpcr_id
    -- DPCR hierarchy joins
    LEFT JOIN dpcr_function f ON d.id = f.dpcr_id
    LEFT JOIN dpcr_function_category fc ON f.id = fc.dpcr_function_id
    LEFT JOIN dpcr_indicator ind ON (
        ind.dpcr_function_id = f.id
        OR ind.dpcr_function_category_id = fc.id
    );

-- Grant SELECT permission to authenticated users
GRANT
SELECT
    ON dpcr_backup_view TO authenticated;