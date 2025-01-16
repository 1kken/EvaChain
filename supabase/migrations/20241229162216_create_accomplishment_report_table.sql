-- Create status enum type if it doesn't exist
CREATE TYPE accomplishment_status AS ENUM ('draft', 'submitted', 'reviewing', 'revision', 'approved');

-- Create accomplishment_report table
CREATE TABLE accomplishment_report (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    using_template BOOLEAN DEFAULT FALSE NOT NULL,
    implementing_unit TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    status accomplishment_status DEFAULT 'draft' NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys and common query patterns
CREATE INDEX idx_accomplishment_report_owner ON accomplishment_report(owner_id);
CREATE INDEX idx_accomplishment_report_unit ON accomplishment_report(unit_id);
CREATE INDEX idx_accomplishment_report_office ON accomplishment_report(office_id);
CREATE INDEX idx_accomplishment_report_program ON accomplishment_report(program_id);
CREATE INDEX idx_accomplishment_report_status ON accomplishment_report(status);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON accomplishment_report 
    FOR EACH ROW 
    EXECUTE FUNCTION fn_set_updated_at();