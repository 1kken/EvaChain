-- Create view for operational plan activities
CREATE OR REPLACE VIEW operational_plan_activities AS
SELECT
    op.id AS operational_plan_id,
    op.title AS operational_plan_title,
    op.implementing_unit,
    op.creator_id,
    op.unit_id,
    op.office_id,
    op.program_id,
    h.id AS header_id,
    h.title AS header_title,
    h.position AS header_position,
    pp.id AS program_project_id,
    pp.description AS program_project_description,
    pp.position AS program_project_position,
    obj.id AS objective_id,
    obj.objective,
    obj.position AS objective_position,
    act.id AS activity_id,
    act.activity,
    act.indicator,
    act.former_state,
    act.desired_state,
    act.q1,
    act.q2,
    act.q3,
    act.q4,
    act.item,
    act.qty,
    act.unit,
    act.unit_cost,
    act.amount,
    act.fund_source,
    act.entity_responsible,
    act.position AS activity_position,
    act.created_at AS activity_created_at,
    act.updated_at AS activity_updated_at
FROM 
    operational_plan op
    LEFT JOIN op_header h ON op.id = h.operational_plan_id
    LEFT JOIN op_program_project pp ON h.id = pp.op_header_id
    LEFT JOIN op_objective obj ON pp.id = obj.op_program_project_id
    LEFT JOIN op_activity act ON obj.id = act.op_objective_id
ORDER BY 
    op.id,
    h.position,
    pp.position,
    obj.position,
    act.position;

-- Grant select permission to authenticated users
GRANT SELECT ON operational_plan_activities TO authenticated;