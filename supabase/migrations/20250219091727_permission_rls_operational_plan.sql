-- Enable RLS on operational_plan table
ALTER TABLE operational_plan ENABLE ROW LEVEL SECURITY;

-- Create policy for read access (authenticated users can read all operational plans)
CREATE POLICY "Enable read access for authenticated users on operational_plan" ON operational_plan FOR
SELECT
    TO authenticated USING (true);

-- Create policy for insert (require create_operational_plan permission)
CREATE POLICY "Enable insert for users with create permission on operational_plan" ON operational_plan FOR INSERT TO authenticated
WITH
    CHECK (check_permission ('create_operational_plan'));

-- Create policy for update (creator or users with edit permission and correct scope)
CREATE POLICY "Enable update for creator or users with edit permission on operational_plan" ON operational_plan FOR
UPDATE TO authenticated USING (
    auth.uid () = creator_id
    OR (
        check_permission ('edit_operational_plan', unit_id)
    )
)
WITH
    CHECK (
        auth.uid () = creator_id
        OR (
            check_permission ('edit_operational_plan', unit_id)
        )
    );

-- Create policy for delete (only creator)
CREATE POLICY "Enable delete for creator on operational_plan" ON operational_plan FOR DELETE TO authenticated USING (auth.uid () = creator_id);

-- Add RLS to related tables (op_header, op_annual_plan, op_activity, op_activity_indicator)
-- op_header
ALTER TABLE op_header ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users on op_header" ON op_header FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert/update/delete through operational_plan policies on op_header" ON op_header FOR ALL TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            operational_plan op
        WHERE
            op.id = op_header.operational_plan_id
            AND (
                op.creator_id = auth.uid ()
                OR (
                    check_permission (
                        'edit_operational_plan',
                        op.office_id,
                        op.unit_id,
                        op.program_id
                    )
                )
            )
    )
);

-- op_annual_plan
ALTER TABLE op_annual_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users on op_annual_plan" ON op_annual_plan FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert/update/delete through operational_plan policies on op_annual_plan" ON op_annual_plan FOR ALL TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            operational_plan op
            JOIN op_header h ON h.operational_plan_id = op.id
        WHERE
            h.id = op_annual_plan.op_header_id
            AND (
                op.creator_id = auth.uid ()
                OR (
                    check_permission (
                        'edit_operational_plan',
                        op.office_id,
                        op.unit_id,
                        op.program_id
                    )
                )
            )
    )
);

-- op_activity
ALTER TABLE op_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users on op_activity" ON op_activity FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert/update/delete through operational_plan policies on op_activity" ON op_activity FOR ALL TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            operational_plan op
            JOIN op_header h ON h.operational_plan_id = op.id
            JOIN op_annual_plan ap ON ap.op_header_id = h.id
        WHERE
            ap.id = op_activity.op_annual_plan_id
            AND (
                op.creator_id = auth.uid ()
                OR (
                    check_permission (
                        'edit_operational_plan',
                        op.office_id,
                        op.unit_id,
                        op.program_id
                    )
                )
            )
    )
);

-- op_activity_indicator
ALTER TABLE op_activity_indicator ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users on op_activity_indicator" ON op_activity_indicator FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert/update/delete through operational_plan policies on op_activity_indicator" ON op_activity_indicator FOR ALL TO authenticated USING (
    EXISTS (
        SELECT
            1
        FROM
            operational_plan op
            JOIN op_header h ON h.operational_plan_id = op.id
            JOIN op_annual_plan ap ON ap.op_header_id = h.id
            JOIN op_activity a ON a.op_annual_plan_id = ap.id
        WHERE
            a.id = op_activity_indicator.op_activity_id
            AND (
                op.creator_id = auth.uid ()
                OR (
                    check_permission (
                        'edit_operational_plan',
                        op.office_id,
                        op.unit_id,
                        op.program_id
                    )
                )
            )
    )
);