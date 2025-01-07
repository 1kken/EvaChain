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
DECLARE
  program_project_included boolean;
BEGIN
  -- Check if the parent program/project is included
  SELECT app.is_included INTO program_project_included
  FROM accomplishment_metrics am
  JOIN accomplishment_program_project app ON app.id = am.accomplishment_program_project_id
  WHERE am.id = toggle_metrics_inclusion.metrics_id;

  -- If program/project is not included, raise an error
  IF NOT program_project_included THEN
    RAISE EXCEPTION 'Cannot include metric: Parent program/project is not included. Please include the program/project first.';
  END IF;

  -- If we get here, we can proceed with the toggle
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