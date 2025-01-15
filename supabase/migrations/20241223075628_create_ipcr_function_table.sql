-- Create ipcr_function table
CREATE TABLE ipcr_function (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    percentage integer NOT NULL,
    ipcr_id UUID REFERENCES ipcr(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(ipcr_id, title)
);

-- Add index for better query performance when ordering by position
CREATE INDEX idx_ipcr_function_position ON ipcr_function(position, ipcr_id);

-- Add index for foreign key
CREATE INDEX idx_ipcr_function_ipcr_id ON ipcr_function(ipcr_id);

-- Add trigger for updating the updated_at timestamp
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON ipcr_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();