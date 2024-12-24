-- Create ipcr_function_sub_category table
CREATE TABLE ipcr_function_sub_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ipcr_function_category_id UUID REFERENCES ipcr_function_category(id) ON DELETE CASCADE NOT NULL,
    sub_category VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX idx_ipcr_function_sub_category_category_id 
    ON ipcr_function_sub_category(ipcr_function_category_id);

CREATE INDEX idx_ipcr_function_sub_category_position 
    ON ipcr_function_sub_category(position, ipcr_function_category_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON ipcr_function_sub_category 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();