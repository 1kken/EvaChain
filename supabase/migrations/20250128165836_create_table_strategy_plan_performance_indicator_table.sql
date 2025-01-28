-- Create strategy_plan_performance_indicator table
CREATE TABLE strategy_plan_performance_indicator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_plan_id UUID REFERENCES strategy_plan(id) ON DELETE CASCADE NOT NULL,
    performance_indicator TEXT NOT NULL,
    base_target TEXT NOT NULL,
    actual_target TEXT NOT NULL,
    concerned_offices TEXT,
    remarks TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_strategy_plan_performance_indicator_strategy_plan_id 
ON strategy_plan_performance_indicator(strategy_plan_id);

CREATE INDEX idx_strategy_plan_performance_indicator_position 
ON strategy_plan_performance_indicator(position, strategy_plan_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON strategy_plan_performance_indicator
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();