-- Create op_program_project table
CREATE TABLE op_program_project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    op_header_id UUID REFERENCES op_header(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_op_program_project_header_id ON op_program_project(op_header_id);
CREATE INDEX idx_op_program_project_position ON op_program_project(position, op_header_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON op_program_project 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();