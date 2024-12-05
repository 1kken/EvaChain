-- Create core_function table
CREATE TABLE core_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   ipcr_teaching_id UUID REFERENCES ipcr_teaching(id) ON DELETE CASCADE NOT NULL,
   unit NUMERIC(4,2) NOT NULL,
   reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON core_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();