-- Create sdg_alignment table
CREATE TABLE sdg_alignment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strat_plan_objective_id UUID REFERENCES strat_plan_objective(id) ON DELETE CASCADE NOT NULL,
    strat_plan_performance_indicator_id UUID REFERENCES strategy_plan_performance_indicator(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensure unique combination of objective and performance indicator
    UNIQUE(strat_plan_objective_id, strat_plan_performance_indicator_id)
);

-- Create indexes for foreign keys
CREATE INDEX idx_sdg_alignment_objective_id 
    ON sdg_alignment(strat_plan_objective_id);
CREATE INDEX idx_sdg_alignment_performance_indicator_id 
    ON sdg_alignment(strat_plan_performance_indicator_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON sdg_alignment
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

-- Create view for SDG alignments with related data
CREATE OR REPLACE VIEW sdg_alignment_view AS
SELECT 
    sa.id as alignment_id,
    sa.created_at as alignment_created_at,
    sa.updated_at as alignment_updated_at,
    -- Strategic Plan data
    sp.id as strategic_plan_id,
    sp.title as strategic_plan_title,
    sp.major_output,
    sp.goal as strategic_plan_goal,
    -- Objective data
    spo.id as objective_id,
    spo.objective,
    spo.position as objective_position,
    -- Performance Indicator data
    sppi.id as performance_indicator_id,
    sppi.base_target,
    sppi.actual_target,
    sppi.concerned_offices,
    sppi.remarks as performance_indicator_remarks,
    sppi.position as performance_indicator_position
FROM 
    sdg_alignment sa
    JOIN strat_plan_objective spo ON sa.strat_plan_objective_id = spo.id
    JOIN strategy_plan_performance_indicator sppi ON sa.strat_plan_performance_indicator_id = sppi.id
    JOIN strategic_plan sp ON spo.strategic_plan_id = sp.id;

-- Grant necessary permissions
GRANT SELECT ON sdg_alignment_view TO authenticated;