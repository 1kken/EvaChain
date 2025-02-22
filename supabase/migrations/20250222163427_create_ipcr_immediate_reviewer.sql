-- Create enum type for supervisor status
CREATE TYPE ipcr_supervisor_status AS ENUM (
    'under_review_raw',
    'revision_raw',
    'reviewed_raw',
    'under_review',
    'revision',
    'approved'
);

-- Create table for IPCR immediate supervisors
CREATE TABLE ipcr_immediate_supervisor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ipcr_id UUID REFERENCES ipcr(id) ON DELETE CASCADE NOT NULL,
    status ipcr_supervisor_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(supervisor_id, ipcr_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_ipcr_immediate_supervisor_ipcr_id ON ipcr_immediate_supervisor(ipcr_id);
CREATE INDEX idx_ipcr_immediate_supervisor_supervisor_id ON ipcr_immediate_supervisor(supervisor_id);
CREATE INDEX idx_ipcr_immediate_supervisor_status ON ipcr_immediate_supervisor(status);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON ipcr_immediate_supervisor 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();