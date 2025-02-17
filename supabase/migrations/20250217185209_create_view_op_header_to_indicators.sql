-- Drop existing view if it exists
DROP VIEW IF EXISTS op_header_indicators;

-- Create view for op header indicators
CREATE
OR REPLACE VIEW op_header_indicators AS
SELECT
    h.id AS header_id,
    h.title AS header_title,
    h.position AS header_position,
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
    act.id AS activity_id,
    act.activity,
    act.position AS activity_position,
    ap.id AS annual_plan_id,
    ap.description AS annual_plan_description,
    ap.position AS annual_plan_position
FROM
    op_header h
    LEFT JOIN op_annual_plan ap ON h.id = ap.op_header_id
    LEFT JOIN op_activity act ON ap.id = act.op_annual_plan_id
    LEFT JOIN op_activity_indicator ind ON act.id = ind.op_activity_id
ORDER BY
    h.position,
    ap.position,
    act.position,
    ind.position;

-- Grant select permission to authenticated users
GRANT
SELECT
    ON op_header_indicators TO authenticated