-- Create input type enum for indicators
CREATE TYPE input_type_op AS ENUM ('percentage', 'number', 'ratio', 'text');

-- Create the indicator table
CREATE TABLE op_activity_indicator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    op_activity_id UUID REFERENCES op_activity(id) ON DELETE CASCADE NOT NULL,
    input_type input_type_op NOT NULL DEFAULT 'text',
    performance_indicator TEXT NOT NULL,
    former_state TEXT NOT NULL,
    q1_target TEXT,
    q2_target TEXT,
    q3_target TEXT,
    q4_target TEXT,
    total TEXT,
    responsible_officer_unit TEXT NOT NULL,
    total_budgetary_requirements TEXT NOT NULL,
    remarks TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for indicator table
CREATE INDEX idx_op_activity_indicator_activity_id ON op_activity_indicator(op_activity_id);
CREATE INDEX idx_op_activity_indicator_position ON op_activity_indicator(position, op_activity_id);

-- Add trigger for indicator table
CREATE TRIGGER set_updated_at BEFORE UPDATE ON op_activity_indicator
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();