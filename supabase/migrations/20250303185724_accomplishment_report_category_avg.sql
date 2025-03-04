CREATE OR REPLACE VIEW accomplishment_report_category_avg AS
WITH category_rates AS (
  SELECT
    ar.id AS report_id,
    CASE 
      -- Case-insensitive matching for Research
      WHEN LOWER(ah.title) ~* 'research' THEN 'research'
      -- Case-insensitive matching for Extension
      WHEN LOWER(ah.title) ~* 'extension' THEN 'extension'
      -- Case-insensitive matching for Instruction
      WHEN LOWER(ah.title) ~* 'instruction' THEN 'instruction'
      -- Case-insensitive matching for Governance and Management
      WHEN (LOWER(ah.title) ~* 'governance.*management' OR LOWER(ah.title) ~* 'governance.*&.*management') THEN 'governance_management'
      ELSE 'other'
    END AS category,
    -- Convert percentage text to numeric value with better error handling
    CASE
      WHEN aai.accomplishment_rate IS NULL OR aai.accomplishment_rate = '' THEN 0
      WHEN aai.accomplishment_rate ~ '[0-9]+(\.[0-9]+)?%' THEN 
        REPLACE(aai.accomplishment_rate, '%', '')::NUMERIC
      WHEN aai.accomplishment_rate ~ '[0-9]+(\.[0-9]+)?' THEN 
        aai.accomplishment_rate::NUMERIC
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
  COALESCE(
    (SELECT ROUND(AVG(rate_value), 2) FROM category_rates 
     WHERE report_id = ar.id AND category = 'research'),
    0
  ) AS research_avg,
  
  COALESCE(
    (SELECT ROUND(AVG(rate_value), 2) FROM category_rates 
     WHERE report_id = ar.id AND category = 'extension'),
    0
  ) AS extension_avg,
  
  COALESCE(
    (SELECT ROUND(AVG(rate_value), 2) FROM category_rates 
     WHERE report_id = ar.id AND category = 'instruction'),
    0
  ) AS instruction_avg,
  
  COALESCE(
    (SELECT ROUND(AVG(rate_value), 2) FROM category_rates 
     WHERE report_id = ar.id AND category = 'governance_management'),
    0
  ) AS governance_management_avg
FROM
  accomplishment_report ar;

-- Grant necessary permissions
GRANT SELECT ON accomplishment_report_category_avg TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW accomplishment_report_category_avg IS 
  'Calculates average accomplishment rates across four categories (Research, Extension, 
   Instruction, and Governance & Management) from accomplishment reports. Categories are 
   determined by accomplishment_header.title field and rates are calculated from 
   accomplishment_activity_indicator.accomplishment_rate values.';