-- Create core_function table
CREATE TABLE core_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   ipcr_teaching_id UUID REFERENCES ipcr_teaching(id) ON DELETE CASCADE NOT NULL,
   unit NUMERIC(4,2),
   reviewer_id UUID REFERENCES auth.users(id),
   position SMALLINT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   UNIQUE(name, ipcr_teaching_id)
);

-- Add index for better query performance when ordering by position
CREATE INDEX idx_core_function_position ON core_function(position, ipcr_teaching_id);

-- Trigger for updating the updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON core_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();