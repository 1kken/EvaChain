-- CREATE OR REPLACE FUNCTION trigger_sync_ipcr_status() RETURNS TRIGGER AS $$
-- BEGIN
--   -- Check if we're already inside this trigger
--   IF current_setting('app.processing_ipcr_sync', true) = 'true' THEN
--     RETURN NEW;
--   END IF;
--   -- Set flag to prevent recursive calls
--   PERFORM set_config('app.processing_ipcr_sync', 'true', true);
--   BEGIN
--     IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) OR 
--        (TG_OP = 'INSERT') OR 
--        (TG_OP = 'DELETE') THEN
--       PERFORM sync_ipcr_status(COALESCE(NEW.ipcr_id, OLD.ipcr_id));
--     END IF;
--     -- Reset flag
--     PERFORM set_config('app.processing_ipcr_sync', 'false', true);
--     RETURN NEW;
--   EXCEPTION WHEN OTHERS THEN
--     -- Make sure we reset the flag even on error
--     PERFORM set_config('app.processing_ipcr_sync', 'false', true);
--     RAISE;
--   END;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
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