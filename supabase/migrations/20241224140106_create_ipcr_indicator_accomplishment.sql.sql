-- First create the new indicator_accomplishment table
CREATE TABLE ipcr_indicator_accomplishment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ipcr_indicator_id UUID REFERENCES ipcr_indicator(id) ON DELETE CASCADE NOT NULL,
    actual_accomplishments TEXT,
    accomplishment_date DATE,
    quantity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_indicator_accomplishment_indicator_id ON ipcr_indicator_accomplishment(ipcr_indicator_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON ipcr_indicator_accomplishment 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();