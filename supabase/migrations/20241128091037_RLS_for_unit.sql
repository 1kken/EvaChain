-- Apply RLS policies to each table
ALTER TABLE unit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on unit" ON unit
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on unit" ON unit
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on unit" ON unit
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on unit" ON unit
    FOR DELETE TO authenticated
    USING (is_system_admin());