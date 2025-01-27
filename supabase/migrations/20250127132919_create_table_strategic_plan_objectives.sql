-- Create strat_plan_objective table
CREATE TABLE strat_plan_objective (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategic_plan_id UUID REFERENCES strategic_plan(id) ON DELETE CASCADE NOT NULL,
    objective TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensure objective is unique per strategic plan
    UNIQUE(strategic_plan_id, objective)
);

-- Create indexes for better query performance
CREATE INDEX idx_strat_plan_objective_strategic_plan_id ON strat_plan_objective(strategic_plan_id);
CREATE INDEX idx_strat_plan_objective_position ON strat_plan_objective(position, strategic_plan_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON strat_plan_objective
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();