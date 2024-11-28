ALTER TABLE office ENABLE ROW LEVEL SECURITY;

-- Create policies for office table
CREATE POLICY "Enable read access for all users on office" ON office
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on office" ON office
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on office" ON office
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on office" ON office
    FOR DELETE TO authenticated
    USING (is_system_admin());