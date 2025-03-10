-- Create view for average accomplishment rate per report
CREATE OR REPLACE VIEW accomplishment_report_avg_rate AS
WITH indicator_rates AS (
  SELECT 
    ar.id AS report_id,
    -- Convert percentage text to numeric value with error handling
    CASE 
      WHEN aai.accomplishment_rate IS NULL OR aai.accomplishment_rate = '' THEN 0
      WHEN aai.accomplishment_rate ~ '[0-9]+(\.[0-9]+)?%' THEN REPLACE(aai.accomplishment_rate, '%', '')::NUMERIC
      WHEN aai.accomplishment_rate ~ '[0-9]+(\.[0-9]+)?' THEN aai.accomplishment_rate::NUMERIC
      ELSE 0
    END AS rate_value
  FROM 
    accomplishment_report ar
    INNER JOIN accomplishment_header ah ON ar.id = ah.accomplishment_report_id
    INNER JOIN accomplishment_annual_plan ap ON ah.id = ap.accomplishment_header_id
    INNER JOIN accomplishment_activity aa ON ap.id = aa.accomplishment_annual_plan_id
    INNER JOIN accomplishment_activity_indicator aai ON aa.id = aai.accomplishment_activity_id
)
SELECT 
  ar.*,
  COALESCE(ROUND(AVG(ir.rate_value), 2), 0) AS total_accomplishment_rate
FROM 
  accomplishment_report ar
  LEFT JOIN indicator_rates ir ON ar.id = ir.report_id
GROUP BY 
  ar.id, ar.title, ar.implementing_unit, ar.owner_id, ar.unit_id, ar.office_id, 
  ar.program_id, ar.review_by, ar.reviewer_position, ar.approve_by, ar.approver_position,
  ar.created_at, ar.updated_at;

-- Grant select permission to authenticated users
GRANT SELECT ON accomplishment_report_avg_rate TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW accomplishment_report_avg_rate IS 
  'Calculates the average accomplishment rate across all indicators for each accomplishment report. 
   Includes all columns from accomplishment_report plus total_accomplishment_rate column.';