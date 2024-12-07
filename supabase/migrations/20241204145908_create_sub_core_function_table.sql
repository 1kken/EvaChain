CREATE TABLE sub_core_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   core_function_id UUID REFERENCES core_function(id) ON DELETE CASCADE NOT NULL,
   name TEXT NOT NULL,
   position INTEGER NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   UNIQUE(core_function_id, name)
);

-- Add an index on position and core_function_id for better performance when sorting
CREATE INDEX idx_sub_core_function_position ON sub_core_function(core_function_id, position);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON sub_core_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();