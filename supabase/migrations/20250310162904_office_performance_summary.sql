-- Create a view to track weighted average performance by office, semester, and year
CREATE OR REPLACE VIEW office_performance_history AS
SELECT
    o.id AS office_id,
    o.code AS office_code,
    o.name AS office_name,
    EXTRACT(YEAR FROM ips.created_at) AS year,
    AVG(CASE WHEN EXTRACT(MONTH FROM ips.created_at) BETWEEN 1 AND 6
        THEN COALESCE(ips.weighted_average, 0)
        END) AS period_1_avg,
    AVG(CASE WHEN EXTRACT(MONTH FROM ips.created_at) BETWEEN 7 AND 12
        THEN COALESCE(ips.weighted_average, 0)
        END) AS period_2_avg
FROM ipcr_performance_summary ips
JOIN office o ON ips.office_id = o.id
GROUP BY o.id, o.code, o.name, EXTRACT(YEAR FROM ips.created_at)
ORDER BY o.name, year;

-- Grant select permission to authenticated users
GRANT SELECT ON office_performance_history TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW office_performance_history IS 'Tracks weighted average performance scores by office, divided into two semester periods per year.';