CREATE OR REPLACE FUNCTION create_accomplishment_report_from_template(
 p_implementing_unit TEXT,
 p_title TEXT,
 p_owner_id UUID,
 p_unit_id INTEGER,
 p_office_id INTEGER DEFAULT NULL,
 p_program_id INTEGER DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
 template_id UUID;
 new_report_id UUID;
 template_program RECORD;
 new_program_id UUID;
BEGIN
 -- Get published template ID
 SELECT id INTO template_id 
 FROM accomplishment_report_template
 WHERE is_published = TRUE
 LIMIT 1;

 IF template_id IS NULL THEN
   RAISE EXCEPTION 'No published template found';
 END IF;

 -- Create new report
 INSERT INTO accomplishment_report (
   using_template,
   implementing_unit, 
   title,
   owner_id,
   unit_id,
   office_id,
   program_id
 ) VALUES (
   TRUE,
   p_implementing_unit,
   p_title, 
   p_owner_id,
   p_unit_id,
   p_office_id,
   p_program_id
 ) RETURNING id INTO new_report_id;

 -- Copy programs and metrics
 FOR template_program IN 
   SELECT * FROM accomplishment_template_program_project
   WHERE accomplishment_report_template_id = template_id
   ORDER BY position  
 LOOP
   INSERT INTO accomplishment_program_project (
     accomplishment_report_id,
     program_project,
     position
   ) VALUES (
     new_report_id,
     template_program.program_project,
     template_program.position
   ) RETURNING id INTO new_program_id;

   INSERT INTO accomplishment_metrics (
     accomplishment_program_project_id,
     metrics,
     former_state, 
     annual_target,
     position
   )
   SELECT 
     new_program_id,
     metrics,
     former_state,
     annual_target,
     position
   FROM accomplishment_template_metrics
   WHERE accomplishment_template_program_project_id = template_program.id;

 END LOOP;

 RETURN new_report_id;
END;
$$;