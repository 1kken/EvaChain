-- 20250128143622_add_years_to_strategic_plan.sql

-- Create major output enum type
CREATE TYPE strategic_major_output AS ENUM (
    'instruction',
    'research',
    'extension',
    'governance_and_management'
);

-- Create strategic_plan table
CREATE TABLE strategic_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    major_output strategic_major_output NOT NULL,
    goal TEXT NOT NULL,
    start_year INTEGER NOT NULL CHECK (start_year >= EXTRACT(YEAR FROM NOW())),
    end_year INTEGER NOT NULL CHECK (end_year >= EXTRACT(YEAR FROM NOW())),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT end_year_after_start CHECK (end_year >= start_year)
);

-- Create indexes for foreign keys and common query patterns
CREATE INDEX idx_strategic_plan_owner ON strategic_plan(owner_id);
CREATE INDEX idx_strategic_plan_unit ON strategic_plan(unit_id);
CREATE INDEX idx_strategic_plan_office ON strategic_plan(office_id);
CREATE INDEX idx_strategic_plan_program ON strategic_plan(program_id);
CREATE INDEX idx_strategic_plan_major_output ON strategic_plan(major_output);
CREATE INDEX idx_strategic_plan_years ON strategic_plan(start_year, end_year);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON strategic_plan
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();