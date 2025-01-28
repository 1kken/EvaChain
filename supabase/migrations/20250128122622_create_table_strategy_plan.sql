-- Create strategy_plan table
CREATE TABLE strategy_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strat_plan_id UUID REFERENCES strategic_plan(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensure description is unique per strategic plan
    UNIQUE(strat_plan_id, description)
);

-- Create indexes for better query performance
CREATE INDEX idx_strategy_plan_strat_plan_id ON strategy_plan(strat_plan_id);
CREATE INDEX idx_strategy_plan_position ON strategy_plan(position, strat_plan_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON strategy_plan
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();