
-- Create other_function table
CREATE TABLE other_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   ipcr_id UUID REFERENCES ipcr(id) ON DELETE CASCADE NOT NULL,
   unit NUMERIC(4,2),
   reviewer_id UUID REFERENCES auth.users(id),
   position SMALLINT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   UNIQUE(name, ipcr_id)
);

-- Add index for better query performance when ordering by position
CREATE INDEX idx_other_function_position ON other_function(position, ipcr_id);

-- Trigger for updating the updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON other_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();