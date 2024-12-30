-- Create accomplishment_program_project table
CREATE TABLE accomplishment_program_project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_included BOOLEAN DEFAULT TRUE NOT NULL,
    accomplishment_report_id UUID REFERENCES accomplishment_report(id) ON DELETE CASCADE NOT NULL,
    program_project VARCHAR(255) NOT NULL,
    position SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(program_project, accomplishment_report_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_program_project_report_id 
    ON accomplishment_program_project(accomplishment_report_id);
    
CREATE INDEX idx_accomplishment_program_project_position 
    ON accomplishment_program_project(position, accomplishment_report_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_program_project 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();