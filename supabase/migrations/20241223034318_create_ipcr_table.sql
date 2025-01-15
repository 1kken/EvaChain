-- Create status enum type if it doesn't exist already
CREATE TYPE ipcr_status AS ENUM ('draft', 'submitted', 'reviewing', 'revision', 'approved');

-- Create ipcr table
CREATE TABLE ipcr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    status ipcr_status DEFAULT 'draft' NOT NULL,
    head_of_operating_unit VARCHAR(255),
    immediate_supervisor VARCHAR(255),
    program_chair VARCHAR(255), 
    dean VARCHAR(255),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys and common query patterns
CREATE INDEX idx_ipcr_owner ON ipcr(owner_id);
CREATE INDEX idx_ipcr_unit ON ipcr(unit_id);
CREATE INDEX idx_ipcr_office ON ipcr(office_id);
CREATE INDEX idx_ipcr_program ON ipcr(program_id);
CREATE INDEX idx_ipcr_status ON ipcr(status);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON ipcr
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();