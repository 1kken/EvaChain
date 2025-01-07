CREATE OR REPLACE FUNCTION toggle_program_project_inclusion(program_project_id uuid)
RETURNS TABLE (
  id uuid,
  is_included boolean,
  accomplishment_report_id uuid,
  program_project varchar(255),
  "position" smallint,
  created_at timestamptz,
  updated_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_is_included boolean;
BEGIN
  -- First get the current state to determine what to toggle to
  SELECT NOT is_included INTO new_is_included
  FROM accomplishment_program_project
  WHERE id = program_project_id;

  -- Update all related metrics to match the new state
  UPDATE accomplishment_metrics am
  SET is_included = new_is_included
  WHERE am.accomplishment_program_project_id = toggle_program_project_inclusion.program_project_id;

  -- Update and return the program/project
  RETURN QUERY
  UPDATE accomplishment_program_project app
  SET is_included = new_is_included
  WHERE app.id = toggle_program_project_inclusion.program_project_id
  RETURNING 
    app.id,
    app.is_included,
    app.accomplishment_report_id,
    app.program_project,
    app."position",
    app.created_at,
    app.updated_at;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION toggle_program_project_inclusion TO authenticated;