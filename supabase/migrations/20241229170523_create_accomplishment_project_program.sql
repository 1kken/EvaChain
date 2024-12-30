-- Create accomplishment_category_project_program table
CREATE TABLE accomplishment_category_project_program (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_category_id UUID REFERENCES accomplishment_category(id) ON DELETE CASCADE NOT NULL,
    sub_category VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_acc_category_proj_prog_category_id ON accomplishment_category_project_program(accomplishment_category_id);
CREATE INDEX idx_acc_category_proj_prog_position ON accomplishment_category_project_program(position, accomplishment_category_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_category_project_program 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();