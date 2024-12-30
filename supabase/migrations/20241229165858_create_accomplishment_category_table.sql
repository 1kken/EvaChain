-- Create accomplishment_category table
CREATE TABLE accomplishment_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accomplishment_report_id UUID REFERENCES accomplishment_report(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(255) NOT NULL,
    position SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(category, accomplishment_report_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_accomplishment_category_report_id ON accomplishment_category(accomplishment_report_id);
CREATE INDEX idx_accomplishment_category_position ON accomplishment_category(position, accomplishment_report_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_category 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();