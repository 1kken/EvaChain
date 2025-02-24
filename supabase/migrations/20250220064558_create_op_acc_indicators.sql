
-- Create the table for storing indicator mappings
CREATE TABLE op_acc_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operational_plan_id UUID NOT NULL REFERENCES operational_plan(id) ON DELETE CASCADE,
    accomplishment_report_id UUID NOT NULL REFERENCES accomplishment_report(id) ON DELETE CASCADE,
    op_activity_indicator_id UUID NOT NULL REFERENCES op_activity_indicator(id) ON DELETE CASCADE,
    accomplishment_activity_indicator_id UUID NOT NULL REFERENCES accomplishment_activity_indicator(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_op_acc_indicators_op_plan ON op_acc_indicators(operational_plan_id);
CREATE INDEX idx_op_acc_indicators_acc_report ON op_acc_indicators(accomplishment_report_id);
CREATE INDEX idx_op_acc_indicators_op_indicator ON op_acc_indicators(op_activity_indicator_id);
CREATE INDEX idx_op_acc_indicators_acc_indicator ON op_acc_indicators(accomplishment_activity_indicator_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON op_acc_indicators
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

-- Grant necessary permissions
GRANT SELECT ON op_acc_indicators TO authenticated;