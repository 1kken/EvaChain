CREATE TABLE sub_core_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   core_function_id UUID REFERENCES core_function(id) ON DELETE CASCADE,
   name TEXT NOT NULL,
   index INTEGER NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON sub_core_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();