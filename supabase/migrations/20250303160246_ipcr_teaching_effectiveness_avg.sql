-- Create view for IPCR with Teaching Effectiveness average
CREATE OR REPLACE VIEW ipcr_teaching_effectiveness_avg AS
WITH teaching_effectiveness_indicators AS (
  SELECT
    f.ipcr_id,
    i.average_rating
  FROM
    ipcr_indicator i
    JOIN ipcr_function_sub_category fsc ON i.ipcr_function_sub_category_id = fsc.id
    JOIN ipcr_function_category fc ON fsc.ipcr_function_category_id = fc.id
    JOIN ipcr_function f ON fc.ipcr_function_id = f.id
  WHERE
    -- Case-insensitive regex match with flexible spacing and optional hyphens/underscores
    fsc.sub_category ~* '^[[:space:]]*teaching[[:space:]_-]*effectiveness[[:space:]]*$'
)
SELECT
  i.*,
  -- Calculate average rating for teaching effectiveness indicators
  CASE
    WHEN COUNT(tei.average_rating) > 0 THEN
      ROUND(
        SUM(COALESCE(tei.average_rating, 0)) / 
        COUNT(CASE WHEN tei.average_rating IS NOT NULL THEN 1 END),
        2
      )
    ELSE NULL
  END AS teaching_effectiveness_avg
FROM
  ipcr i
  LEFT JOIN teaching_effectiveness_indicators tei ON i.id = tei.ipcr_id
GROUP BY
  i.id, i.title, i.status, i.head_of_operating_unit, i.immediate_supervisor, 
  i.immediate_supervisor_position, i.program_chair, i.dean, 
  i.owner_id, i.unit_id, i.office_id, i.program_id, i.created_at, i.updated_at;

-- Grant select permission to authenticated users
GRANT SELECT ON ipcr_teaching_effectiveness_avg TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW ipcr_teaching_effectiveness_avg IS 
  'Calculates the average rating for indicators associated with Teaching Effectiveness subcategories, 
   including all IPCR details. The regex handles case-insensitivity, extra spaces, and formatting variations.';