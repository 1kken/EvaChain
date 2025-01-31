-- Create opcr_indicator table
-- Create opcr_indicator table
CREATE TABLE opcr_indicator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opcr_function_id UUID REFERENCES opcr_function(id) ON DELETE CASCADE,
    opcr_function_category_id UUID REFERENCES opcr_function_category(id) ON DELETE CASCADE,
    success_indicator TEXT NOT NULL,
    alloted_budget TEXT,
    division_individuals_accountable TEXT,
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
CREATE INDEX idx_opcr_indicator_function_id ON opcr_indicator(opcr_function_id);
CREATE INDEX idx_opcr_indicator_category_id ON opcr_indicator(opcr_function_category_id);
CREATE INDEX idx_opcr_indicator_position ON opcr_indicator(position, opcr_function_category_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at BEFORE UPDATE ON opcr_indicator
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();