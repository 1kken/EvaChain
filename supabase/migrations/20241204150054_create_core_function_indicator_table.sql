-- Create status enum type
CREATE TYPE indicator_status AS ENUM ('draft', 'submitted', 'reviewing', 'revision', 'approved');
CREATE TABLE indicator (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   status indicator_status DEFAULT 'draft' NOT NULL,
   indicator TEXT NOT NULL,
   accomplishment TEXT,
   indicator_date DATE,
   accomplishment_date DATE,
   quality_rating NUMERIC(3,2),
   efficiency_rating NUMERIC(3,2),
   timeliness_rating NUMERIC(3,2),
   average_rating NUMERIC(3,2),
   core_function_id UUID REFERENCES core_function(id) ON DELETE CASCADE,
   sub_core_function_id UUID REFERENCES sub_core_function(id) ON DELETE CASCADE,
   position INTEGER NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add an index for better query performance when ordering by position
CREATE INDEX idx__indicator_position 
ON indicator(position, core_function_id);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON indicator
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();