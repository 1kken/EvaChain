-- Create view that filters operational plans based on creator's role
CREATE
OR REPLACE VIEW operational_plan_of_heads AS
SELECT
    op.*
FROM
    operational_plan op
    INNER JOIN user_roles ur ON op.creator_id = ur.user_id
    INNER JOIN roles r ON ur.role_id = r.id
WHERE
    r.name IN ('head_of_operating_unit', 'vice-president');

-- Grant necessary permissions
GRANT
SELECT
    ON operational_plan_of_heads TO authenticated;

-- Add comment explaining the view
COMMENT ON VIEW operational_plan_of_heads IS 'Operational plans created by users with head_of_operating_unit or vice-president roles';