-- Create status enum type
CREATE TYPE ipcr_status AS ENUM ('draft', 'submitted', 'reviewing','revision', 'approved');

-- Create ipcr_teaching table with status
CREATE TABLE ipcr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    status ipcr_status DEFAULT 'draft' NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON ipcr
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();