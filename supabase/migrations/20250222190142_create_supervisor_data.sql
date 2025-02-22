-- Drop the existing function
DROP FUNCTION IF EXISTS create_supervisor_data(UUID);

-- Create the updated function that returns added supervisor IDs
CREATE OR REPLACE FUNCTION create_supervisor_data(p_ipcr_id UUID)
    RETURNS TABLE (
        supervisor_id UUID,
        ipcr_id UUID,
        created_at TIMESTAMP WITH TIME ZONE
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
AS $$
DECLARE
    temp_supervisors UUID[];
BEGIN
    -- Create temporary table to store results
    CREATE TEMP TABLE temp_results (
        supervisor_id UUID,
        ipcr_id UUID,
        created_at TIMESTAMP WITH TIME ZONE
    ) ON COMMIT DROP;

    -- Insert supervisors from ipcr_indicator and capture IDs
    WITH inserted AS (
        INSERT INTO ipcr_immediate_supervisor (supervisor_id, ipcr_id, created_at, updated_at)
        SELECT DISTINCT
            i.immediate_supervisor_id,
            f.ipcr_id,
            f.created_at,
            f.updated_at
        FROM ipcr_indicator i
        JOIN ipcr_function f ON i.ipcr_function_id = f.id
        JOIN ipcr ON f.ipcr_id = ipcr.id
        WHERE 
            i.immediate_supervisor_id IS NOT NULL
            AND ipcr.status = 'submitted_raw'
            AND f.ipcr_id = p_ipcr_id
            AND NOT EXISTS (
                SELECT 1 
                FROM ipcr_immediate_supervisor s 
                WHERE s.supervisor_id = i.immediate_supervisor_id 
                AND s.ipcr_id = f.ipcr_id
            )
        RETURNING ipcr_immediate_supervisor.supervisor_id, ipcr_immediate_supervisor.ipcr_id, ipcr_immediate_supervisor.created_at
    )
    INSERT INTO temp_results
    SELECT * FROM inserted;

    -- Insert supervisors from ipcr_function_category and capture IDs
    WITH inserted AS (
        INSERT INTO ipcr_immediate_supervisor (supervisor_id, ipcr_id, created_at, updated_at)
        SELECT DISTINCT
            fc.immediate_supervisor_id,
            f.ipcr_id,
            f.created_at,
            f.updated_at
        FROM ipcr_function_category fc
        JOIN ipcr_function f ON fc.ipcr_function_id = f.id
        JOIN ipcr ON f.ipcr_id = ipcr.id
        WHERE 
            fc.immediate_supervisor_id IS NOT NULL
            AND ipcr.status = 'submitted_raw'
            AND f.ipcr_id = p_ipcr_id
            AND NOT EXISTS (
                SELECT 1 
                FROM ipcr_immediate_supervisor s 
                WHERE s.supervisor_id = fc.immediate_supervisor_id 
                AND s.ipcr_id = f.ipcr_id
            )
        RETURNING ipcr_immediate_supervisor.supervisor_id, ipcr_immediate_supervisor.ipcr_id, ipcr_immediate_supervisor.created_at
    )
    INSERT INTO temp_results
    SELECT * FROM inserted;

    -- Return all collected results
    RETURN QUERY 
    SELECT DISTINCT tr.supervisor_id, tr.ipcr_id, tr.created_at 
    FROM temp_results tr;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_supervisor_data(UUID) TO authenticated;
