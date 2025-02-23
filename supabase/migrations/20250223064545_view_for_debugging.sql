-- Enhanced view for monitoring status and consensus
CREATE OR REPLACE VIEW ipcr_supervisor_status_view AS
WITH supervisor_statuses AS (
    SELECT 
        s.ipcr_id,
        s.status,
        s.supervisor_id,
        p.first_name,
        p.last_name,
        is_consensus_required_status(s.status::ipcr_supervisor_status) as requires_consensus
    FROM ipcr_immediate_supervisor s
    LEFT JOIN profiles p ON s.supervisor_id = p.id
)
SELECT 
    i.id as ipcr_id,
    i.status as ipcr_status,
    CASE 
        WHEN COUNT(ss.supervisor_id) = 0 THEN 'No supervisors assigned'
        WHEN COUNT(DISTINCT ss.status) = 1 AND bool_and(ss.requires_consensus) 
            THEN 'All supervisors agree on action-required status'
        WHEN COUNT(DISTINCT ss.status) = 1 
            THEN 'All supervisors agree (no action required)'
        ELSE 'Supervisors have different statuses'
    END as consensus_status,
    COUNT(ss.supervisor_id) as total_supervisors,
    COUNT(DISTINCT ss.status) as unique_statuses,
    bool_or(ss.requires_consensus) as has_action_required_status,
    json_agg(
        CASE 
            WHEN ss.supervisor_id IS NOT NULL THEN
                json_build_object(
                    'supervisor_id', ss.supervisor_id,
                    'status', ss.status,
                    'name', ss.first_name || ' ' || ss.last_name,
                    'requires_consensus', ss.requires_consensus
                )
            ELSE NULL
        END
    ) FILTER (WHERE ss.supervisor_id IS NOT NULL) as supervisors
FROM ipcr i
LEFT JOIN supervisor_statuses ss ON i.id = ss.ipcr_id
GROUP BY i.id, i.status;

-- Grant necessary permissions
GRANT SELECT ON ipcr_supervisor_status_view TO authenticated;