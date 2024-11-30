-- Create status enum type
CREATE TYPE ipcr_status AS ENUM ('draft', 'submitted', 'reviewing', 'approved');

-- Create IPCR table
CREATE TABLE ipcr (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    office_id INTEGER NOT NULL REFERENCES office(id) ON DELETE CASCADE,
    unit_id INTEGER NOT NULL REFERENCES unit(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    status ipcr_status NOT NULL DEFAULT 'draft',
    higher_education_units NUMERIC(3,2),
    advanced_education_units NUMERIC(3,2),
    research_units NUMERIC(3,2),
    technical_extension_units NUMERIC(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys and frequently queried columns
CREATE INDEX idx_ipcr_owner_id ON ipcr(owner_id);
CREATE INDEX idx_ipcr_supervisor_id ON ipcr(supervisor_id);
CREATE INDEX idx_ipcr_office_id ON ipcr(office_id);
CREATE INDEX idx_ipcr_unit_id ON ipcr(unit_id);
CREATE INDEX idx_ipcr_program_id ON ipcr(program_id);
CREATE INDEX idx_ipcr_status ON ipcr(status);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON ipcr
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

-- Enable Row Level Security
ALTER TABLE ipcr ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own IPCR"
    ON ipcr FOR SELECT
    TO authenticated
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own IPCR"
    ON ipcr FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own IPCR"
    ON ipcr FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own IPCR"
    ON ipcr FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);