CREATE TABLE core_function_indicator (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   indicator TEXT NOT NULL,
   accomplishment TEXT,
   indicator_date DATE,
   accomplishment_date DATE,
   quality_rating NUMERIC(3,2),
   efficiency_rating NUMERIC(3,2),
   timeliness_rating NUMERIC(3,2),
   average_rating NUMERIC(3,2),
   core_function_id UUID REFERENCES core_function(id) ON DELETE CASCADE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON core_function_indicator
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();