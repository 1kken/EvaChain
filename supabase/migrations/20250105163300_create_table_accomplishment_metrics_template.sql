-- Create accomplishment_template_metrics table
CREATE TABLE accomplishment_template_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_template_program_project_id UUID REFERENCES accomplishment_template_program_project(id) ON DELETE CASCADE NOT NULL,
    metrics TEXT NOT NULL,
    former_state TEXT,
    annual_target TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_template_metrics_program_project_id 
ON accomplishment_template_metrics(accomplishment_template_program_project_id);

CREATE INDEX idx_accomplishment_template_metrics_position 
ON accomplishment_template_metrics(position, accomplishment_template_program_project_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_template_metrics 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();