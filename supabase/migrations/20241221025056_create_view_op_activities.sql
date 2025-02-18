-- Create updated operational plan activities view
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
    act.position AS activity_position,
    ind.id AS indicator_id,
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
    ind.position AS indicator_position,
    act.created_at AS activity_created_at,
    act.updated_at AS activity_updated_at,
    ind.created_at AS indicator_created_at,
    ind.updated_at AS indicator_updated_at
FROM
    operational_plan op
    LEFT JOIN op_header h ON op.id = h.operational_plan_id
    LEFT JOIN op_annual_plan ap ON h.id = ap.op_header_id
    LEFT JOIN op_activity act ON ap.id = act.op_annual_plan_id
    LEFT JOIN op_activity_indicator ind ON act.id = ind.op_activity_id
ORDER BY
    op.id,
    h.position,
    ap.position,
    act.position,
    ind.position;

-- Grant select permission to authenticated users
GRANT
SELECT
    ON operational_plan_activities TO authenticated;