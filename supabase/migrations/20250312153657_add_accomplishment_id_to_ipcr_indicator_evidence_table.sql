-- Add accomplishment_indicator_id and uploader_id columns to ipcr_indicator_evidence table
ALTER TABLE ipcr_indicator_evidence
ADD COLUMN accomplishment_indicator_id UUID REFERENCES accomplishment_activity_indicator (id) ON DELETE CASCADE NOT NULL,
ADD COLUMN uploader_id UUID REFERENCES profiles (id) ON DELETE CASCADE NOT NULL;

-- Create index for accomplishment_indicator_id
CREATE INDEX idx_ipcr_indicator_evidence_accomplishment_indicator_id ON ipcr_indicator_evidence (accomplishment_indicator_id);

-- Create index for uploader_id
CREATE INDEX idx_ipcr_indicator_evidence_uploader_id ON ipcr_indicator_evidence (uploader_id);