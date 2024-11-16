-- Create units table
CREATE TABLE public.units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,     -- e.g., 'SLUC', 'NLUC'
    name VARCHAR(255) NOT NULL,           -- e.g., 'South La Union Campus'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create offices table
CREATE TABLE public.offices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unit_id UUID REFERENCES units(id) ON DELETE RESTRICT NOT NULL,
    code VARCHAR(50) NOT NULL,            -- e.g., 'CCS', 'CCHAMS'
    name VARCHAR(255) NOT NULL,           -- e.g., 'College of Computer Studies'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(unit_id, code)                 -- Ensure unique office codes within a unit
);

-- Function to extract unit code from office code
CREATE OR REPLACE FUNCTION get_unit_from_office_code(office_code TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Extract the suffix after the last underscore
    RETURN SPLIT_PART(office_code, '_', 2);
END;
$$ LANGUAGE plpgsql;