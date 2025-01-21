-- Create accomplishment_header table
CREATE TABLE accomplishment_header (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_report_id UUID REFERENCES accomplishment_report(id) ON DELETE CASCADE NOT NULL,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_header_report_id ON accomplishment_header(accomplishment_report_id);
CREATE INDEX idx_accomplishment_header_position ON accomplishment_header(position, accomplishment_report_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_header 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();