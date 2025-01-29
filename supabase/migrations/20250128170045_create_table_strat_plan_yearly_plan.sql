-- Create strat_plan_yearly_plan table
CREATE TABLE strat_plan_yearly_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_plan_performance_indicator_id UUID REFERENCES strategy_plan_performance_indicator(id) ON DELETE CASCADE NOT NULL,
    year INTEGER NOT NULL,
    target TEXT NOT NULL,
    budget NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensure unique combination of performance indicator and year
    UNIQUE(strategy_plan_performance_indicator_id, year)
);

-- Create index for foreign key
CREATE INDEX idx_strat_plan_yearly_plan_performance_indicator_id 
    ON strat_plan_yearly_plan(strategy_plan_performance_indicator_id);

-- Create index for year queries
CREATE INDEX idx_strat_plan_yearly_plan_year
    ON strat_plan_yearly_plan(year);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON strat_plan_yearly_plan
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();