-- Create op_objective table
CREATE TABLE op_objective (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    op_program_project_id UUID REFERENCES op_program_project(id) ON DELETE CASCADE NOT NULL,
    objective TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_op_objective_program_project_id ON op_objective(op_program_project_id);
CREATE INDEX idx_op_objective_position ON op_objective(position, op_program_project_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON op_objective 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();