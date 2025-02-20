-- Create accomplishment_activity table
CREATE TABLE accomplishment_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_annual_plan_id UUID REFERENCES accomplishment_annual_plan(id) ON DELETE CASCADE NOT NULL,
    activity TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_activity_annual_plan_id 
    ON accomplishment_activity(accomplishment_annual_plan_id);
    
CREATE INDEX idx_accomplishment_activity_position 
    ON accomplishment_activity(position, accomplishment_annual_plan_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_activity 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();