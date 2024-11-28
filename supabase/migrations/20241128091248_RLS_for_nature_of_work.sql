ALTER TABLE nature_of_work ENABLE ROW LEVEL SECURITY;

-- Create policies for nature_of_work table
CREATE POLICY "Enable read access for all users on nature_of_work" ON nature_of_work
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on nature_of_work" ON nature_of_work
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on nature_of_work" ON nature_of_work
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on nature_of_work" ON nature_of_work
    FOR DELETE TO authenticated
    USING (is_system_admin());