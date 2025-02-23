-- Create trigger function for status synchronization
CREATE OR REPLACE FUNCTION trigger_sync_ipcr_status()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) OR
       (TG_OP = 'INSERT') OR
       (TG_OP = 'DELETE') THEN
        PERFORM sync_ipcr_status(COALESCE(NEW.ipcr_id, OLD.ipcr_id));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS sync_ipcr_status_trigger ON ipcr_immediate_supervisor;
CREATE TRIGGER sync_ipcr_status_trigger
AFTER INSERT OR UPDATE OR DELETE ON ipcr_immediate_supervisor
FOR EACH ROW EXECUTE FUNCTION trigger_sync_ipcr_status();