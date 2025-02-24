DROP FUNCTION IF EXISTS sync_ipcr_supervisors(uuid);

CREATE OR REPLACE FUNCTION sync_ipcr_supervisors(p_ipcr_id UUID) 
RETURNS TABLE (
    sup_id UUID,
    sup_action TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY WITH 
        -- Get current supervisors
        current_supervisors AS (
            SELECT DISTINCT supervisor_id AS curr_id
            FROM ipcr_immediate_supervisor 
            WHERE ipcr_id = p_ipcr_id
        ),
        -- Get needed supervisors from both indicators and categories
        needed_supervisors AS (
            SELECT DISTINCT immediate_supervisor_id AS needed_id
            FROM ipcr_indicator ii
            JOIN ipcr_function f ON ii.ipcr_function_id = f.id
            WHERE f.ipcr_id = p_ipcr_id
            AND ii.immediate_supervisor_id IS NOT NULL
            
            UNION
            
            SELECT DISTINCT immediate_supervisor_id AS needed_id
            FROM ipcr_function_category fc
            JOIN ipcr_function f ON fc.ipcr_function_id = f.id
            WHERE f.ipcr_id = p_ipcr_id
            AND fc.immediate_supervisor_id IS NOT NULL
        ),
        -- Identify supervisors to remove
        to_remove AS (
            DELETE FROM ipcr_immediate_supervisor iis
            WHERE iis.ipcr_id = p_ipcr_id
            AND EXISTS (
                SELECT 1 FROM current_supervisors cs
                WHERE cs.curr_id = iis.supervisor_id
                AND NOT EXISTS (
                    SELECT 1 FROM needed_supervisors ns
                    WHERE ns.needed_id = cs.curr_id
                )
            )
            RETURNING supervisor_id AS removed_id
        ),
        -- Identify supervisors to add
        to_add AS (
            INSERT INTO ipcr_immediate_supervisor (supervisor_id, ipcr_id)
            SELECT ns.needed_id, p_ipcr_id
            FROM needed_supervisors ns
            WHERE NOT EXISTS (
                SELECT 1 FROM current_supervisors cs
                WHERE cs.curr_id = ns.needed_id
            )
            RETURNING supervisor_id AS added_id
        ),
        -- Identify unchanged supervisors
        unchanged AS (
            SELECT cs.curr_id AS unchanged_id
            FROM current_supervisors cs
            WHERE EXISTS (
                SELECT 1 FROM needed_supervisors ns
                WHERE ns.needed_id = cs.curr_id
            )
            AND NOT EXISTS (
                SELECT 1 FROM to_remove
                WHERE removed_id = cs.curr_id
            )
        )
        -- Combine all results
        SELECT removed_id AS sup_id, 'removed'::text AS sup_action FROM to_remove
        UNION ALL
        SELECT added_id AS sup_id, 'added'::text AS sup_action FROM to_add
        UNION ALL
        SELECT unchanged_id AS sup_id, 'unchanged'::text AS sup_action FROM unchanged;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION sync_ipcr_supervisors(UUID) TO authenticated;