CREATE
OR REPLACE VIEW ipcr_supervisors AS
WITH
    combined_supervisors AS (
        -- Get supervisors from categories and indicators
        SELECT DISTINCT
            f.ipcr_id,
            fc.immediate_supervisor_id
        FROM
            ipcr_function_category fc
            JOIN ipcr_function f ON f.id = fc.ipcr_function_id
        WHERE
            fc.immediate_supervisor_id IS NOT NULL
        UNION
        SELECT DISTINCT
            f.ipcr_id,
            i.immediate_supervisor_id
        FROM
            ipcr_indicator i
            JOIN ipcr_function f ON f.id = i.ipcr_function_id
        WHERE
            i.immediate_supervisor_id IS NOT NULL
    )
SELECT DISTINCT
    ON (cs.ipcr_id, cs.immediate_supervisor_id) cs.ipcr_id,
    cs.immediate_supervisor_id as id,
    p.first_name || ' ' || CASE
        WHEN p.middle_name IS NOT NULL
        AND p.middle_name != '' THEN p.middle_name || ' '
        ELSE ''
    END || p.last_name as full_name,
    pos.name as position
FROM
    combined_supervisors cs
    JOIN profiles p ON p.id = cs.immediate_supervisor_id
    LEFT JOIN position pos ON pos.id = p.position_id
ORDER BY
    cs.ipcr_id,
    cs.immediate_supervisor_id,
    full_name;

-- Grant necessary permissions
GRANT
SELECT
    ON ipcr_supervisors TO authenticated;