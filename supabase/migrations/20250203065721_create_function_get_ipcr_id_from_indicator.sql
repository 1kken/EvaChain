CREATE OR REPLACE FUNCTION get_ipcr_id_from_indicator(p_indicator_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_ipcr_id UUID;
BEGIN
    -- Try to get IPCR ID through function
    SELECT f.ipcr_id INTO v_ipcr_id
    FROM ipcr_indicator i
    JOIN ipcr_function f ON i.ipcr_function_id = f.id
    WHERE i.id = p_indicator_id;

    -- If not found, try through category
    IF v_ipcr_id IS NULL THEN
        SELECT f.ipcr_id INTO v_ipcr_id
        FROM ipcr_indicator i
        JOIN ipcr_function_category fc ON i.ipcr_function_category_id = fc.id
        JOIN ipcr_function f ON fc.ipcr_function_id = f.id
        WHERE i.id = p_indicator_id;
    END IF;

    -- If still not found, try through sub-category
    IF v_ipcr_id IS NULL THEN
        SELECT f.ipcr_id INTO v_ipcr_id
        FROM ipcr_indicator i
        JOIN ipcr_function_sub_category fsc ON i.ipcr_function_sub_category_id = fsc.id
        JOIN ipcr_function_category fc ON fsc.ipcr_function_category_id = fc.id
        JOIN ipcr_function f ON fc.ipcr_function_id = f.id
        WHERE i.id = p_indicator_id;
    END IF;

    RETURN v_ipcr_id;
END;
$$;