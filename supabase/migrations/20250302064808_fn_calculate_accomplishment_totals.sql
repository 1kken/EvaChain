CREATE OR REPLACE FUNCTION fn_calculate_accomplishment_totals()
RETURNS TRIGGER AS $$
DECLARE
    total_value TEXT;
    accomplishment_rate_value TEXT;
    q1_val NUMERIC;
    q2_val NUMERIC;
    q3_val NUMERIC;
    q4_val NUMERIC;
    annual_target_val NUMERIC;
    sum_val NUMERIC;
    total_antecedent NUMERIC;
    total_consequent TEXT;
    extracted_target NUMERIC;
BEGIN
    -- Skip processing if input_type is 'text'
    IF NEW.input_type = 'text' THEN
        RETURN NEW;
    END IF;

    -- Process based on input_type
    CASE NEW.input_type
        WHEN 'number' THEN
            -- Convert quarterly values to numbers, ignoring empty/null values
            q1_val := NULLIF(TRIM(COALESCE(NEW.q1_accomplishment, '')), '')::NUMERIC;
            q2_val := NULLIF(TRIM(COALESCE(NEW.q2_accomplishment, '')), '')::NUMERIC;
            q3_val := NULLIF(TRIM(COALESCE(NEW.q3_accomplishment, '')), '')::NUMERIC;
            q4_val := NULLIF(TRIM(COALESCE(NEW.q4_accomplishment, '')), '')::NUMERIC;
            
            -- Calculate sum of valid values
            sum_val := COALESCE(q1_val, 0) + COALESCE(q2_val, 0) + COALESCE(q3_val, 0) + COALESCE(q4_val, 0);
            
            -- Set total value
            total_value := sum_val::TEXT;
            
            -- Calculate accomplishment rate if annual_target is numeric
            annual_target_val := NULLIF(TRIM(COALESCE(NEW.annual_target, '')), '')::NUMERIC;
            IF annual_target_val IS NOT NULL AND annual_target_val <> 0 THEN
                accomplishment_rate_value := TO_CHAR((sum_val / annual_target_val) * 100, 'FM990.00%');
            ELSE
                accomplishment_rate_value := NULL;
            END IF;
            
        WHEN 'ratio' THEN
            -- Initialize values
            total_antecedent := 0;
            total_consequent := NULL;
            
            -- Extract and sum antecedents from quarterly values
            -- For q1
            IF NEW.q1_accomplishment IS NOT NULL AND NEW.q1_accomplishment != '' THEN
                q1_val := (REGEXP_MATCH(NEW.q1_accomplishment, '^(\d+):'))[1]::NUMERIC;
                IF total_consequent IS NULL AND NEW.q1_accomplishment ~ ':\d+' THEN
                    total_consequent := (REGEXP_MATCH(NEW.q1_accomplishment, ':(\d+)'))[1];
                END IF;
                total_antecedent := total_antecedent + COALESCE(q1_val, 0);
            END IF;
            
            -- For q2
            IF NEW.q2_accomplishment IS NOT NULL AND NEW.q2_accomplishment != '' THEN
                q2_val := (REGEXP_MATCH(NEW.q2_accomplishment, '^(\d+):'))[1]::NUMERIC;
                IF total_consequent IS NULL AND NEW.q2_accomplishment ~ ':\d+' THEN
                    total_consequent := (REGEXP_MATCH(NEW.q2_accomplishment, ':(\d+)'))[1];
                END IF;
                total_antecedent := total_antecedent + COALESCE(q2_val, 0);
            END IF;
            
            -- For q3
            IF NEW.q3_accomplishment IS NOT NULL AND NEW.q3_accomplishment != '' THEN
                q3_val := (REGEXP_MATCH(NEW.q3_accomplishment, '^(\d+):'))[1]::NUMERIC;
                IF total_consequent IS NULL AND NEW.q3_accomplishment ~ ':\d+' THEN
                    total_consequent := (REGEXP_MATCH(NEW.q3_accomplishment, ':(\d+)'))[1];
                END IF;
                total_antecedent := total_antecedent + COALESCE(q3_val, 0);
            END IF;
            
            -- For q4
            IF NEW.q4_accomplishment IS NOT NULL AND NEW.q4_accomplishment != '' THEN
                q4_val := (REGEXP_MATCH(NEW.q4_accomplishment, '^(\d+):'))[1]::NUMERIC;
                IF total_consequent IS NULL AND NEW.q4_accomplishment ~ ':\d+' THEN
                    total_consequent := (REGEXP_MATCH(NEW.q4_accomplishment, ':(\d+)'))[1];
                END IF;
                total_antecedent := total_antecedent + COALESCE(q4_val, 0);
            END IF;
            
            -- Set total value with format "antecedent:consequent"
            IF total_consequent IS NOT NULL THEN
                total_value := total_antecedent::TEXT || ':' || total_consequent;
            ELSE
                total_value := total_antecedent::TEXT;
            END IF;
            
            -- Calculate accomplishment rate
            IF NEW.annual_target IS NOT NULL AND NEW.annual_target != '' AND NEW.annual_target ~ '^(\d+):' THEN
                extracted_target := (REGEXP_MATCH(NEW.annual_target, '^(\d+):'))[1]::NUMERIC;
                IF extracted_target <> 0 THEN
                    accomplishment_rate_value := TO_CHAR((total_antecedent / extracted_target) * 100, 'FM990.00%');
                END IF;
            END IF;
            
        WHEN 'percentage' THEN
            -- Convert percentage strings to numeric values
            q1_val := CASE 
                WHEN NEW.q1_accomplishment IS NOT NULL AND NEW.q1_accomplishment != '' 
                THEN REPLACE(NEW.q1_accomplishment, '%', '')::NUMERIC 
                ELSE NULL 
            END;
            
            q2_val := CASE 
                WHEN NEW.q2_accomplishment IS NOT NULL AND NEW.q2_accomplishment != '' 
                THEN REPLACE(NEW.q2_accomplishment, '%', '')::NUMERIC 
                ELSE NULL 
            END;
            
            q3_val := CASE 
                WHEN NEW.q3_accomplishment IS NOT NULL AND NEW.q3_accomplishment != '' 
                THEN REPLACE(NEW.q3_accomplishment, '%', '')::NUMERIC 
                ELSE NULL 
            END;
            
            q4_val := CASE 
                WHEN NEW.q4_accomplishment IS NOT NULL AND NEW.q4_accomplishment != '' 
                THEN REPLACE(NEW.q4_accomplishment, '%', '')::NUMERIC 
                ELSE NULL 
            END;
            
            -- Calculate sum of valid values
            sum_val := COALESCE(q1_val, 0) + COALESCE(q2_val, 0) + COALESCE(q3_val, 0) + COALESCE(q4_val, 0);
            
            -- Set total value with percentage format
            total_value := sum_val::TEXT || '%';
            
            -- Calculate accomplishment rate
            annual_target_val := CASE 
                WHEN NEW.annual_target IS NOT NULL AND NEW.annual_target != '' 
                THEN REPLACE(NEW.annual_target, '%', '')::NUMERIC 
                ELSE NULL 
            END;
            
            IF annual_target_val IS NOT NULL AND annual_target_val <> 0 THEN
                accomplishment_rate_value := TO_CHAR((sum_val / annual_target_val) * 100, 'FM990.00%');
            ELSE
                accomplishment_rate_value := NULL;
            END IF;
    END CASE;
    
    -- Update NEW record with calculated values
    NEW.total := total_value;
    NEW.accomplishment_rate := accomplishment_rate_value;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on accomplishment_activity_indicator table
DROP TRIGGER IF EXISTS tr_calculate_accomplishment_totals ON accomplishment_activity_indicator;
CREATE TRIGGER tr_calculate_accomplishment_totals
BEFORE INSERT OR UPDATE OF q1_accomplishment, q2_accomplishment, q3_accomplishment, q4_accomplishment, annual_target, input_type
ON accomplishment_activity_indicator
FOR EACH ROW
EXECUTE FUNCTION fn_calculate_accomplishment_totals();

-- Add comment explaining trigger functionality
COMMENT ON FUNCTION fn_calculate_accomplishment_totals() IS 
'Dynamically calculates total and accomplishment_rate based on input_type (number, ratio, percentage) 
and quarterly accomplishment values. Skips processing for input_type="text".';