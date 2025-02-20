CREATE TABLE accomplishment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ipcr_indicator_accomplishment_id UUID NOT NULL,
    input_value TEXT NOT NULL,
    quarter INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (ipcr_indicator_accomplishment_id) REFERENCES ipcr_indicator_accomplishment(id) ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX idx_accomplishment_history_accomplishment_id 
ON accomplishment_history(ipcr_indicator_accomplishment_id);

CREATE INDEX idx_accomplishment_history_created_at 
ON accomplishment_history(created_at);