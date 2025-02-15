-- Create blockchain_data table
CREATE TABLE blockchain_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_cid TEXT NOT NULL,
    action TEXT NOT NULL DEFAULT 'backup',
    file_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'data/evidence',
    blockchain_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_blockchain_data_file_cid ON blockchain_data(file_cid);
CREATE INDEX idx_blockchain_data_file_name ON blockchain_data(file_name);
CREATE INDEX idx_blockchain_data_type ON blockchain_data(type);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON blockchain_data 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();

-- Enable Row Level Security
ALTER TABLE blockchain_data ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for all authenticated users" 
    ON blockchain_data 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable insert for authenticated users" 
    ON blockchain_data 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);