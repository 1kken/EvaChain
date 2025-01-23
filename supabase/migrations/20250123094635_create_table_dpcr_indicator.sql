-- Create dpcr_indicator table
CREATE TABLE dpcr_indicator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpcr_function_id UUID REFERENCES dpcr_function(id) ON DELETE CASCADE,
    dpcr_function_category_id UUID REFERENCES dpcr_function_category(id) ON DELETE CASCADE,
    success_indicator TEXT NOT NULL,
    alloted_budget TEXT,
    division_individuals_accountable TEXT,
    physical_targets TEXT,
    actual_accomplishments TEXT,
    quality_rating NUMERIC(3,2),
    efficiency_rating NUMERIC(3,2),
    timeliness_rating NUMERIC(3,2),
    average_rating NUMERIC(3,2),
    remarks TEXT,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_dpcr_indicator_function_id ON dpcr_indicator(dpcr_function_id);
CREATE INDEX idx_dpcr_indicator_category_id ON dpcr_indicator(dpcr_function_category_id);
CREATE INDEX idx_dpcr_indicator_position ON dpcr_indicator(position, dpcr_function_category_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON dpcr_indicator
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();