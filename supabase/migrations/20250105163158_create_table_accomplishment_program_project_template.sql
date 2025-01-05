-- Create accomplishment_template_program_project table
CREATE TABLE accomplishment_template_program_project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_report_template_id UUID REFERENCES accomplishment_report_template(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL,
    program_project TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_template_program_project_template_id 
    ON accomplishment_template_program_project(accomplishment_report_template_id);
CREATE INDEX idx_accomplishment_template_program_project_position 
    ON accomplishment_template_program_project(position, accomplishment_report_template_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON accomplishment_template_program_project
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();