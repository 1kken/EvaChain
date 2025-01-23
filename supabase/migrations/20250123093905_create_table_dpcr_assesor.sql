-- Create dpcr_assessors table
CREATE TABLE dpcr_assessor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dpcr_id UUID REFERENCES dpcr(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    sequence INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_dpcr_assessor_dpcr_id ON dpcr_assessor(dpcr_id);
CREATE INDEX idx_dpcr_assessor_sequence ON dpcr_assessor(sequence, dpcr_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON dpcr_assessor
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();