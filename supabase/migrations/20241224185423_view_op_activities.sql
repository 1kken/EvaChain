-- Drop existing view if it exists
DROP VIEW IF EXISTS operational_plan_activities;

-- Create view for operational plan activities
CREATE
OR REPLACE VIEW operational_plan_activities AS
SELECT
    op.id AS operational_plan_id,
    op.title AS operational_plan_title,
    op.implementing_unit,
    op.creator_id,
    op.unit_id,
    op.office_id,
    op.program_id,
    op.review_by,
    op.reviewer_position,
    op.approve_by,
    op.approver_position,
    h.id AS header_id,
    h.title AS header_title,
    h.position AS header_position,
    ap.id AS annual_plan_id,
    ap.description AS annual_plan_description,
    ap.position AS annual_plan_position,
    act.id AS activity_id,
    act.activity,
    act.input_type,
    act.performance_indicator,
    act.former_state,
    act.q1_target,
    act.q2_target,
    act.q3_target,
    act.q4_target,
    act.total,
    act.responsible_officer_unit,
    act.total_budgetary_requirements,
    act.position AS activity_position,
    act.created_at AS activity_created_at,
    act.updated_at AS activity_updated_at
FROM
    operational_plan op
    LEFT JOIN op_header h ON op.id = h.operational_plan_id
    LEFT JOIN op_annual_plan ap ON h.id = ap.op_header_id
    LEFT JOIN op_activity act ON ap.id = act.op_annual_plan_id
ORDER BY
    op.id,
    h.position,
    ap.position,
    act.position;

-- Grant select permission to authenticated users
GRANT
SELECT
    ON operational_plan_activities TO authenticated;