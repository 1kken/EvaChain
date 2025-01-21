-- Create accomplishment_annual_plan table
CREATE TABLE accomplishment_annual_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_header_id UUID REFERENCES accomplishment_header(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_annual_plan_header_id ON accomplishment_annual_plan(accomplishment_header_id);
CREATE INDEX idx_accomplishment_annual_plan_position ON accomplishment_annual_plan(position, accomplishment_header_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_annual_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();