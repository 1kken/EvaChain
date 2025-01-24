-- Create dpcr_function table
CREATE TABLE dpcr_function (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpcr_id UUID REFERENCES dpcr(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(dpcr_id, title)
);

-- Create indexes for better query performance
CREATE INDEX idx_dpcr_function_dpcr_id ON dpcr_function(dpcr_id);
CREATE INDEX idx_dpcr_function_position ON dpcr_function(position, dpcr_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON dpcr_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();