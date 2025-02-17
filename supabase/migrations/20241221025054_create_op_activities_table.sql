-- First create the activity table
CREATE TABLE op_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    op_annual_plan_id UUID REFERENCES op_annual_plan(id) ON DELETE CASCADE NOT NULL,
    activity TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Then add indexes after table exists
CREATE INDEX idx_op_activity_annual_plan_id ON op_activity(op_annual_plan_id);
CREATE INDEX idx_op_activity_position ON op_activity(position, op_annual_plan_id);

-- Finally add the trigger
CREATE TRIGGER set_updated_at BEFORE UPDATE ON op_activity
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();