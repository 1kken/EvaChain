-- Create opcr_function table
CREATE TABLE opcr_function (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opcr_id UUID REFERENCES opcr(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(opcr_id, title)
);

-- Create indexes for better query performance
CREATE INDEX idx_opcr_function_opcr_id ON opcr_function(opcr_id);
CREATE INDEX idx_opcr_function_position ON opcr_function(position, opcr_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at BEFORE UPDATE ON opcr_function
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();