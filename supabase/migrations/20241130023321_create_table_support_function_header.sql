-- Create support_function_header table
CREATE TABLE support_function_header (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    ipcr_id UUID NOT NULL REFERENCES ipcr(id) ON DELETE CASCADE,
    units NUMERIC(3,2) CHECK (units BETWEEN 1.00 AND 5.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_support_function_header_ipcr_id ON support_function_header(ipcr_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON support_function_header
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

-- Enable Row Level Security
ALTER TABLE support_function_header ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can perform all operations on their own support function headers"
    ON support_function_header
    TO authenticated
    USING (ipcr_id IN (
        SELECT id FROM ipcr WHERE owner_id = auth.uid()
    ));