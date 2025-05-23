-- Create evidence table with updated reference
CREATE TABLE ipcr_indicator_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ipcr_indicator_accomplishment_id UUID REFERENCES ipcr_indicator_accomplishment(id) ON DELETE CASCADE NOT NULL,
    file_path TEXT NOT NULL,
    confidence_level integer NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX idx_ipcr_indicator_evidence_accomplishment_id ON ipcr_indicator_evidence(ipcr_indicator_accomplishment_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ipcr_indicator_evidence 
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();