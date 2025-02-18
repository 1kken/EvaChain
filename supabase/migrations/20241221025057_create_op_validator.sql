-- First safely drop the type if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'validation_result') THEN
        DROP TYPE validation_result CASCADE;
    END IF;
END $$;

-- Create the composite type
CREATE TYPE validation_result AS (
    is_valid boolean,
    validation_message text
);

-- Create the validation function
CREATE OR REPLACE FUNCTION validate_operational_plan(p_operational_plan_id UUID)
RETURNS validation_result
LANGUAGE plpgsql AS $$
DECLARE
    result validation_result;
    invalid_header RECORD;
    invalid_annual_plan RECORD;
    invalid_activity RECORD;
    invalid_indicator RECORD;
BEGIN
    -- Check if operational plan has at least one header
    IF NOT EXISTS (
        SELECT 1 
        FROM op_header 
        WHERE operational_plan_id = p_operational_plan_id
    ) THEN
        result := (false, 'Operational Plan must have at least one header');
        RETURN result;
    END IF;

    -- Check if each header has at least one annual plan
    SELECT h.id, h.title 
    INTO invalid_header
    FROM op_header h
    WHERE h.operational_plan_id = p_operational_plan_id
    AND NOT EXISTS (
        SELECT 1 
        FROM op_annual_plan ap 
        WHERE ap.op_header_id = h.id
    )
    LIMIT 1;

    IF FOUND THEN
        result := (false, format('Header "%s": No annual plans found', invalid_header.title));
        RETURN result;
    END IF;

    -- Check if each annual plan has at least one activity
    SELECT ap.id, ap.description, h.title as header_title
    INTO invalid_annual_plan
    FROM op_annual_plan ap
    JOIN op_header h ON h.id = ap.op_header_id
    WHERE h.operational_plan_id = p_operational_plan_id
    AND NOT EXISTS (
        SELECT 1 
        FROM op_activity a 
        WHERE a.op_annual_plan_id = ap.id
    )
    LIMIT 1;

    IF FOUND THEN
        result := (false, format('Annual Plan "%s" under header "%s": No activities found', 
            invalid_annual_plan.description, invalid_annual_plan.header_title));
        RETURN result;
    END IF;

    -- Check if each activity has at least one indicator
    SELECT a.id, a.activity, ap.description as annual_plan_desc, h.title as header_title
    INTO invalid_activity
    FROM op_activity a
    JOIN op_annual_plan ap ON ap.id = a.op_annual_plan_id
    JOIN op_header h ON h.id = ap.op_header_id
    WHERE h.operational_plan_id = p_operational_plan_id
    AND NOT EXISTS (
        SELECT 1 
        FROM op_activity_indicator i 
        WHERE i.op_activity_id = a.id
    )
    LIMIT 1;

    IF FOUND THEN
        result := (false, format('Activity "%s" under annual plan "%s" (header: "%s"): No indicators found', 
            invalid_activity.activity, 
            invalid_activity.annual_plan_desc,
            invalid_activity.header_title));
        RETURN result;
    END IF;

    -- Check if all indicator fields are filled
    SELECT 
        i.id,
        i.performance_indicator,
        a.activity,
        ap.description as annual_plan_desc,
        h.title as header_title,
        CASE
            WHEN i.performance_indicator IS NULL THEN 'Performance Indicator'
            WHEN i.former_state IS NULL THEN 'Former State'
            WHEN i.responsible_officer_unit IS NULL THEN 'Responsible Officer/Unit'
            WHEN i.total_budgetary_requirements IS NULL THEN 'Total Budgetary Requirements'
        END as missing_field
    INTO invalid_indicator
    FROM op_activity_indicator i
    JOIN op_activity a ON a.id = i.op_activity_id
    JOIN op_annual_plan ap ON ap.id = a.op_annual_plan_id
    JOIN op_header h ON h.id = ap.op_header_id
    WHERE h.operational_plan_id = p_operational_plan_id
    AND (
        i.performance_indicator IS NULL OR
        i.former_state IS NULL OR
        i.responsible_officer_unit IS NULL OR
        i.total_budgetary_requirements IS NULL
    )
    LIMIT 1;

    IF FOUND THEN
        result := (false, format('Indicator under activity "%s" (annual plan: "%s", header: "%s"): Missing %s', 
            invalid_indicator.activity,
            invalid_indicator.annual_plan_desc,
            invalid_indicator.header_title,
            invalid_indicator.missing_field));
        RETURN result;
    END IF;

    -- If we get here, everything is valid
    result := (true, 'Operational Plan is complete and valid');
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION validate_operational_plan(UUID) TO authenticated;