ALTER TABLE employee_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on employee_status" ON employee_status
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on employee_status" ON employee_status
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on employee_status" ON employee_status
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on employee_status" ON employee_status
    FOR DELETE TO authenticated
    USING (is_system_admin());