-- Create ipcr_function_category table
CREATE TABLE ipcr_function_category (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ipcr_function_id UUID REFERENCES ipcr_function(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(255) NOT NULL,
    unit NUMERIC(4,2),
    immediate_supervisor_id UUID REFERENCES auth.users(id),
    position SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(category, ipcr_function_id)
);

-- Add index for foreign key references and position ordering
CREATE INDEX idx_ipcr_function_category_function_id ON ipcr_function_category(ipcr_function_id);
CREATE INDEX idx_ipcr_function_category_position ON ipcr_function_category(position, ipcr_function_id);
CREATE INDEX idx_ipcr_function_category_supervisor_id ON ipcr_function_category(immediate_supervisor_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON ipcr_function_category
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();