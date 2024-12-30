-- Create accomplishment_metrics table
CREATE TABLE accomplishment_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_category_id UUID REFERENCES accomplishment_category(id) ON DELETE CASCADE,
    accomplishment_category_project_program_id UUID REFERENCES accomplishment_category_project_program(id) ON DELETE CASCADE,
    metrics TEXT NOT NULL,
    former_state TEXT,
    annual_target TEXT,
    quarter_1_accomplishment TEXT,
    quarter_2_accomplishment TEXT,
    quarter_3_accomplishment TEXT,
    quarter_4_accomplishment TEXT,
    total_accomplishment TEXT,
    variance TEXT,
    remarks TEXT,
    position SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_metrics_category_id 
    ON accomplishment_metrics(accomplishment_category_id);

CREATE INDEX idx_accomplishment_metrics_project_program_id 
    ON accomplishment_metrics(accomplishment_category_project_program_id);

CREATE INDEX idx_accomplishment_metrics_position 
    ON accomplishment_metrics(position, accomplishment_category_id);

CREATE INDEX idx_accomplishment_metrics_position_prog 
    ON accomplishment_metrics(position, accomplishment_category_project_program_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_metrics 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();