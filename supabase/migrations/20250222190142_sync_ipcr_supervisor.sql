CREATE OR REPLACE FUNCTION sync_ipcr_supervisors(p_ipcr_id UUID) 
RETURNS TABLE (
    supervisor_id UUID,
    action TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_supervisors UUID[];
    needed_supervisors UUID[];
BEGIN
    -- Get all current supervisors for this IPCR
    SELECT ARRAY_AGG(supervisor_id)
    INTO current_supervisors
    FROM ipcr_immediate_supervisor
    WHERE ipcr_id = p_ipcr_id;

    -- Get all supervisors that should be assigned based on indicators and categories
    WITH combined_supervisors AS (
        -- Get supervisors from indicators
        SELECT DISTINCT i.immediate_supervisor_id
        FROM ipcr_indicator i
        JOIN ipcr_function f ON i.ipcr_function_id = f.id
        WHERE f.ipcr_id = p_ipcr_id
        AND i.immediate_supervisor_id IS NOT NULL
        
        UNION
        
        -- Get supervisors from categories
        SELECT DISTINCT fc.immediate_supervisor_id
        FROM ipcr_function_category fc
        JOIN ipcr_function f ON fc.ipcr_function_id = f.id
        WHERE f.ipcr_id = p_ipcr_id
        AND fc.immediate_supervisor_id IS NOT NULL
    )
    SELECT ARRAY_AGG(immediate_supervisor_id)
    INTO needed_supervisors
    FROM combined_supervisors;

    -- Remove supervisors that are no longer needed
    IF current_supervisors IS NOT NULL THEN
        DELETE FROM ipcr_immediate_supervisor
        WHERE ipcr_id = p_ipcr_id
        AND supervisor_id = ANY(current_supervisors)
        AND (needed_supervisors IS NULL OR supervisor_id != ALL(needed_supervisors))
        RETURNING supervisor_id, 'removed' AS action;
    END IF;

    -- Add new supervisors that aren't yet in the table
    IF needed_supervisors IS NOT NULL THEN
        INSERT INTO ipcr_immediate_supervisor (supervisor_id, ipcr_id)
        SELECT DISTINCT ns.supervisor_id, p_ipcr_id
        FROM unnest(needed_supervisors) AS ns(supervisor_id)
        WHERE ns.supervisor_id != ALL(COALESCE(current_supervisors, ARRAY[]::UUID[]))
        RETURNING supervisor_id, 'added' AS action;
    END IF;

    RETURN QUERY
    SELECT s.supervisor_id, 'unchanged' AS action
    FROM ipcr_immediate_supervisor s
    WHERE s.ipcr_id = p_ipcr_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION sync_ipcr_supervisors(UUID) TO authenticated;
