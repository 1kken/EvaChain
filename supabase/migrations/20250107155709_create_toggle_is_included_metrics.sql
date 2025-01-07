-- Create function to toggle metrics inclusion
CREATE OR REPLACE FUNCTION toggle_metrics_inclusion(metrics_id uuid)
RETURNS TABLE (
  id uuid,
  is_included boolean,
  accomplishment_program_project_id uuid,
  metrics text,
  former_state text,
  annual_target text,
  quarter_1_accomplishment text,
  quarter_2_accomplishment text,
  quarter_3_accomplishment text,
  quarter_4_accomplishment text,
  total_accomplishment text,
  variance text,
  remarks text,
  "position" smallint,
  created_at timestamptz,
  updated_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE accomplishment_metrics am
  SET is_included = NOT am.is_included
  WHERE am.id = toggle_metrics_inclusion.metrics_id
  RETURNING 
    am.id,
    am.is_included,
    am.accomplishment_program_project_id,
    am.metrics,
    am.former_state,
    am.annual_target,
    am.quarter_1_accomplishment,
    am.quarter_2_accomplishment,
    am.quarter_3_accomplishment,
    am.quarter_4_accomplishment,
    am.total_accomplishment,
    am.variance,
    am.remarks,
    am."position",
    am.created_at,
    am.updated_at;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION toggle_metrics_inclusion TO authenticated;