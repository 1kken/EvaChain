-- Create dpcr table
CREATE TABLE dpcr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    review_by VARCHAR(255) NOT NULL,
    reviewer_position VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys and common query patterns
CREATE INDEX idx_dpcr_owner ON dpcr(owner_id);
CREATE INDEX idx_dpcr_unit ON dpcr(unit_id);
CREATE INDEX idx_dpcr_office ON dpcr(office_id);
CREATE INDEX idx_dpcr_program ON dpcr(program_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON dpcr
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();