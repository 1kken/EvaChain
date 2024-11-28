ALTER TABLE program ENABLE ROW LEVEL SECURITY;

-- Create policies for program table
CREATE POLICY "Enable read access for all users on program" ON program
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on program" ON program
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on program" ON program
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on program" ON program
    FOR DELETE TO authenticated
    USING (is_system_admin());