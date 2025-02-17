-- Create status enum type
CREATE TYPE ipcr_indicator_status AS ENUM ('draft', 'submitted', 'reviewing','revision', 'approved');

-- Create ipcr_indicator table
CREATE TABLE ipcr_indicator (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status ipcr_indicator_status DEFAULT 'draft' NOT NULL,
    ipcr_function_id UUID REFERENCES ipcr_function(id) ON DELETE CASCADE,
    ipcr_function_sub_category_id UUID REFERENCES ipcr_function_sub_category(id) ON DELETE CASCADE,
    ipcr_function_category_id UUID REFERENCES ipcr_function_category(id) ON DELETE CASCADE,
    final_output TEXT NOT NULL,
    success_indicator TEXT NOT NULL,
    actual_accomplishments TEXT,
    accomplishment_date DATE,
    op_activity_indicator_id UUID REFERENCES op_activity_indicator(id) ON DELETE SET NULL NOT NULL,
    quality_rating NUMERIC(3,2),
    efficiency_rating NUMERIC(3,2),
    timeliness_rating NUMERIC(3,2),
    average_rating NUMERIC(3,2),
    remarks TEXT,
    position SMALLINT NOT NULL,
    immediate_supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    units NUMERIC(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for foreign key relationships and common query patterns
CREATE INDEX idx_ipcr_indicator_function_id 
    ON ipcr_indicator(ipcr_function_id);

CREATE INDEX idx_ipcr_indicator_sub_category_id 
    ON ipcr_indicator(ipcr_function_sub_category_id);

CREATE INDEX idx_ipcr_indicator_category_id 
    ON ipcr_indicator(ipcr_function_category_id);

CREATE INDEX idx_ipcr_indicator_op_activity_indicator_id 
    ON ipcr_indicator(op_activity_indicator_id);

CREATE INDEX idx_ipcr_indicator_immediate_supervisor 
    ON ipcr_indicator(immediate_supervisor_id);

-- Add composite index for position ordering within categories
CREATE INDEX idx_ipcr_indicator_position 
    ON ipcr_indicator(position, ipcr_function_category_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON ipcr_indicator
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();