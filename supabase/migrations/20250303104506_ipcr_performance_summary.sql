-- Create view for IPCR performance summary with weighted average calculation
CREATE
OR REPLACE VIEW ipcr_performance_summary AS
WITH
    indicator_ratings AS (
        -- Get all indicator ratings across different levels
        SELECT
            f.ipcr_id,
            i.average_rating
        FROM
            ipcr_indicator i
            -- Join with function directly
            LEFT JOIN ipcr_function f ON i.ipcr_function_id = f.id
        UNION ALL
        -- Get indicators from function_category level
        SELECT
            f.ipcr_id,
            i.average_rating
        FROM
            ipcr_indicator i
            JOIN ipcr_function_category fc ON i.ipcr_function_category_id = fc.id
            JOIN ipcr_function f ON fc.ipcr_function_id = f.id
        UNION ALL
        -- Get indicators from function_sub_category level
        SELECT
            f.ipcr_id,
            i.average_rating
        FROM
            ipcr_indicator i
            JOIN ipcr_function_sub_category fsc ON i.ipcr_function_sub_category_id = fsc.id
            JOIN ipcr_function_category fc ON fsc.ipcr_function_category_id = fc.id
            JOIN ipcr_function f ON fc.ipcr_function_id = f.id
    )
SELECT
    i.*,
    -- Calculate weighted average, handling NULL values
    CASE
        WHEN COUNT(ir.average_rating) > 0 THEN ROUND(
            SUM(COALESCE(ir.average_rating, 0)) / COUNT(
                CASE
                    WHEN ir.average_rating IS NOT NULL THEN 1
                END
            ),
            2
        )
        ELSE 0
    END AS weighted_average
FROM
    ipcr i
    LEFT JOIN indicator_ratings ir ON i.id = ir.ipcr_id
GROUP BY
    i.id,
    i.title,
    i.status,
    i.head_of_operating_unit,
    i.immediate_supervisor,
    i.immediate_supervisor_position,
    i.program_chair,
    i.dean,
    i.owner_id,
    i.unit_id,
    i.office_id,
    i.program_id,
    i.created_at,
    i.updated_at;

-- Grant select permission to authenticated users
GRANT
SELECT
    ON ipcr_performance_summary TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW ipcr_performance_summary IS 'Calculates weighted average ratings for each IPCR based on all associated indicators across hierarchical levels.';