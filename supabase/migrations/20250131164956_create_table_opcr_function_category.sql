-- Create opcr_function_category table
CREATE TABLE opcr_function_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opcr_function_id UUID REFERENCES opcr_function(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(255) NOT NULL,
    position SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(category, opcr_function_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_opcr_function_category_function_id ON opcr_function_category(opcr_function_id);
CREATE INDEX idx_opcr_function_category_position ON opcr_function_category(position, opcr_function_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at BEFORE UPDATE ON opcr_function_category
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();