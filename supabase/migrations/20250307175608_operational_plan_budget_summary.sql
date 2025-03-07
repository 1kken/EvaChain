CREATE OR REPLACE VIEW operational_plan_budget_summary AS
SELECT 
    op.id AS operational_plan_id,
    op.title AS operational_plan_title,
    op.implementing_unit,
    op.status,
    op.review_by,
    op.reviewer_position,
    op.approve_by,
    op.approver_position,
    op.unit_id,
    op.office_id,
    op.program_id,
    op.created_at,
    op.updated_at,
    SUM(
        CASE 
            WHEN ind.total_budgetary_requirements ~ '^[0-9,.]+$' 
            THEN COALESCE(CAST(REPLACE(ind.total_budgetary_requirements, ',', '') AS NUMERIC), 0)
            ELSE 0
        END
    ) AS total_budget_requirements
FROM 
    operational_plan op
LEFT JOIN 
    op_header h ON op.id = h.operational_plan_id
LEFT JOIN 
    op_annual_plan ap ON h.id = ap.op_header_id
LEFT JOIN 
    op_activity act ON ap.id = act.op_annual_plan_id
LEFT JOIN 
    op_activity_indicator ind ON act.id = ind.op_activity_id
GROUP BY 
    op.id, op.title, op.implementing_unit, op.status, op.review_by, op.reviewer_position,
    op.approve_by, op.approver_position, op.unit_id, op.office_id, op.program_id,
    op.created_at, op.updated_at
ORDER BY 
    op.title;

-- Grant SELECT permission to authenticated users
GRANT SELECT ON operational_plan_budget_summary TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW operational_plan_budget_summary IS 'Consolidates operational plan details with summed budgetary requirements across all indicators';