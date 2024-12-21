-- Create op_activity table
CREATE TABLE op_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    op_objective_id UUID REFERENCES op_objective(id) ON DELETE CASCADE NOT NULL,
    activity TEXT NOT NULL,
    indicator TEXT NOT NULL,
    former_state VARCHAR(255) NOT NULL,
    desired_state VARCHAR(255) NOT NULL,
    q1 BOOLEAN DEFAULT false NOT NULL,
    q2 BOOLEAN DEFAULT false NOT NULL,
    q3 BOOLEAN DEFAULT false NOT NULL,
    q4 BOOLEAN DEFAULT false NOT NULL,
    item TEXT,
    qty TEXT,
    unit TEXT,
    unit_cost TEXT,
    amount TEXT,
    fund_source TEXT,
    entity_responsible TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_op_activity_objective_id ON op_activity(op_objective_id);
CREATE INDEX idx_op_activity_position ON op_activity(position, op_objective_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON op_activity
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();