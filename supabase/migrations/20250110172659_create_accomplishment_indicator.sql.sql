CREATE TYPE input_type_accomplishment AS ENUM ('percentage', 'number', 'ratio', 'text');
-- Create accomplishment_activity_indicator table
CREATE TABLE accomplishment_activity_indicator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_activity_id UUID REFERENCES accomplishment_activity(id) ON DELETE CASCADE NOT NULL,
    input_type input_type_accomplishment NOT NULL DEFAULT 'text',
    performance_indicator TEXT NOT NULL,
    annual_target TEXT NOT NULL,
    q1_accomplishment TEXT,
    q2_accomplishment TEXT,
    q3_accomplishment TEXT,
    q4_accomplishment TEXT,
    total TEXT,
    accomplishment_rate TEXT,
    responsible_officer_unit TEXT NOT NULL,
    remarks TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_activity_indicator_activity_id 
    ON accomplishment_activity_indicator(accomplishment_activity_id);
    
CREATE INDEX idx_accomplishment_activity_indicator_position 
    ON accomplishment_activity_indicator(position, accomplishment_activity_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_activity_indicator 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();