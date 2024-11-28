ALTER TABLE position ENABLE ROW LEVEL SECURITY;

-- Create policies for position table
CREATE POLICY "Enable read access for all users on position" ON position
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on position" ON position
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on position" ON position
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on position" ON position
    FOR DELETE TO authenticated
    USING (is_system_admin());