-- Create input type enum
CREATE TYPE input_type_op AS ENUM ('percentage', 'number', 'ratio', 'text');

-- Create activities table
CREATE TABLE op_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    op_annual_plan_id UUID REFERENCES op_annual_plan(id) ON DELETE CASCADE NOT NULL,
    activity TEXT NOT NULL,
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
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_op_activity_annual_plan_id ON op_activity(op_annual_plan_id);
CREATE INDEX idx_op_activity_position ON op_activity(position, op_annual_plan_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at BEFORE UPDATE ON op_activity
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();