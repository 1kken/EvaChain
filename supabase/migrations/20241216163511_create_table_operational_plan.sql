CREATE TYPE op_status AS ENUM ('draft', 'submitted', 'reviewing', 'revision', 'approved');

-- Create operational_plan table
CREATE TABLE operational_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status op_status DEFAULT 'draft' NOT NULL,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE NOT NULL,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    implementing_unit TEXT NOT NULL,
    review_by VARCHAR(255)  NOT NULL,
    reviewer_position VARCHAR(255)  NOT NULL,
    approve_by VARCHAR(255)  NOT NULL,
    approver_position VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys and commonly searched fields
CREATE INDEX idx_operational_plan_unit_id ON operational_plan(unit_id);
CREATE INDEX idx_operational_plan_office_id ON operational_plan(office_id);
CREATE INDEX idx_operational_plan_program_id ON operational_plan(program_id);

-- Add trigger for updating timestamps
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON operational_plan 
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();