-- Create accomplishment_report_template table
CREATE TABLE accomplishment_report_template (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON accomplishment_report_template
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();