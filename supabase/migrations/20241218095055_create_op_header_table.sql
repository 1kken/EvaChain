-- Create op_header table
CREATE TABLE op_header (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operational_plan_id UUID REFERENCES operational_plan(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_op_header_operational_plan_id ON op_header(operational_plan_id);
CREATE INDEX idx_op_header_position ON op_header(position, operational_plan_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON op_header 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();