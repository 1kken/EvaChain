-- Create view for DPCR performance summary with weighted average calculation
CREATE
OR REPLACE VIEW dpcr_performance_summary AS
WITH
    indicator_ratings AS (
        -- Get all indicator ratings from function level
        SELECT
            f.dpcr_id,
            i.average_rating
        FROM
            dpcr_indicator i
            JOIN dpcr_function f ON i.dpcr_function_id = f.id
        UNION ALL
        -- Get all indicator ratings from category level
        SELECT
            f.dpcr_id,
            i.average_rating
        FROM
            dpcr_indicator i
            JOIN dpcr_function_category fc ON i.dpcr_function_category_id = fc.id
            JOIN dpcr_function f ON fc.dpcr_function_id = f.id
    )
SELECT
    d.*,
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
    dpcr d
    LEFT JOIN indicator_ratings ir ON d.id = ir.dpcr_id
GROUP BY
    d.id,
    d.status,
    d.title,
    d.review_by,
    d.reviewer_position,
    d.owner_id,
    d.unit_id,
    d.office_id,
    d.program_id,
    d.created_at,
    d.updated_at;

-- Grant select permission to authenticated users
GRANT
SELECT
    ON dpcr_performance_summary TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW dpcr_performance_summary IS 'Calculates weighted average ratings for each DPCR based on all associated indicators across hierarchical levels.';