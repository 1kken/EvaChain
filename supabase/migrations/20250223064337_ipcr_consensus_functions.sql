-- Helper function to check if status requires consensus
CREATE OR REPLACE FUNCTION is_consensus_required_status(p_status ipcr_supervisor_status)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_status IN ('revision_raw');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function to check if status requires immediate sync
CREATE OR REPLACE FUNCTION is_immediate_sync_status(p_status ipcr_supervisor_status)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_status IN ('under_review_raw', 'under_review', 'revision_raw', 'revision');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_supervisor_consensus_status(p_ipcr_id UUID) 
RETURNS ipcr_supervisor_status AS $$
DECLARE
  v_consensus_status ipcr_supervisor_status;
  v_supervisor_count INTEGER;
  v_reviewed_count INTEGER;
  v_has_consensus BOOLEAN;
  v_current_status ipcr_status;
BEGIN
  -- Get current IPCR status
  SELECT status INTO v_current_status FROM ipcr WHERE id = p_ipcr_id;
  
  -- Get total number of supervisors
  SELECT COUNT(*) INTO v_supervisor_count 
  FROM ipcr_immediate_supervisor 
  WHERE ipcr_id = p_ipcr_id;
  
  -- Return NULL if no supervisors
  IF v_supervisor_count = 0 THEN
    RETURN NULL;
  END IF;
  
  -- First check for immediate sync statuses (any supervisor triggers change)
  SELECT status INTO v_consensus_status 
  FROM ipcr_immediate_supervisor 
  WHERE ipcr_id = p_ipcr_id AND is_immediate_sync_status(status) 
  LIMIT 1;
  
  IF v_consensus_status IS NOT NULL THEN
    RETURN v_consensus_status;
  END IF;
  
  -- Check for reviewed_raw status (special case)
  SELECT COUNT(*) INTO v_reviewed_count 
  FROM ipcr_immediate_supervisor 
  WHERE ipcr_id = p_ipcr_id AND status = 'reviewed_raw';
  
  -- If all supervisors are at reviewed_raw, return this status
  IF v_reviewed_count = v_supervisor_count THEN
    RETURN 'reviewed_raw';
  END IF;
  
  -- Check for approved status (requires all supervisors)
  SELECT COUNT(*) = v_supervisor_count INTO v_has_consensus 
  FROM ipcr_immediate_supervisor 
  WHERE ipcr_id = p_ipcr_id AND status = 'approved';
  
  IF v_has_consensus THEN
    RETURN 'approved';
  END IF;
  
  -- Check consensus for other action-required statuses
  FOR v_consensus_status IN SELECT unnest(enum_range(NULL::ipcr_supervisor_status)) LOOP
    -- Skip if status doesn't require consensus or is reviewed_raw (handled above)
    CONTINUE WHEN NOT is_consensus_required_status(v_consensus_status) 
              OR v_consensus_status = 'reviewed_raw';
    
    -- Check if all supervisors have this status
    SELECT COUNT(*) = v_supervisor_count INTO v_has_consensus 
    FROM ipcr_immediate_supervisor 
    WHERE ipcr_id = p_ipcr_id AND status = v_consensus_status;
    
    IF v_has_consensus THEN
      RETURN v_consensus_status;
    END IF;
  END LOOP;
  
  -- For revision_raw specifically, maintain until all supervisors reach reviewed_raw
  IF v_current_status = 'revision_raw'::ipcr_status AND v_reviewed_count < v_supervisor_count THEN
    RETURN 'revision_raw';
  END IF;
  
  -- Return NULL to indicate no status change needed
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync IPCR status
CREATE OR REPLACE FUNCTION sync_ipcr_status(p_ipcr_id UUID)
RETURNS void AS $$
DECLARE
    v_consensus_status ipcr_supervisor_status;
    v_current_ipcr_status ipcr_status;
BEGIN
    -- Get current IPCR status
    SELECT status INTO v_current_ipcr_status
    FROM ipcr
    WHERE id = p_ipcr_id;

    -- Get consensus status if applicable
    v_consensus_status := get_supervisor_consensus_status(p_ipcr_id);

    -- Update IPCR status if we have a new status to apply
    IF v_consensus_status IS NOT NULL THEN
        UPDATE ipcr
        SET status = CASE 
            -- Action-required statuses
            WHEN v_consensus_status = 'reviewed_raw' THEN 'reviewed_raw'::ipcr_status
            -- Immediate sync statuses
            WHEN v_consensus_status = 'under_review_raw' THEN 'under_review_raw'::ipcr_status
            WHEN v_consensus_status = 'under_review' THEN 'under_review'::ipcr_status
            WHEN v_consensus_status = 'revision_raw' THEN 'revision_raw'::ipcr_status
            WHEN v_consensus_status = 'revision' THEN 'revision'::ipcr_status
            -- Approved status (requires all)
            WHEN v_consensus_status = 'approved' THEN 'approved'::ipcr_status
            ELSE v_current_ipcr_status
        END
        WHERE id = p_ipcr_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_consensus_required_status(ipcr_supervisor_status) TO authenticated;
GRANT EXECUTE ON FUNCTION is_immediate_sync_status(ipcr_supervisor_status) TO authenticated;
GRANT EXECUTE ON FUNCTION get_supervisor_consensus_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION sync_ipcr_status(UUID) TO authenticated;