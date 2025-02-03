CREATE
OR REPLACE VIEW ipcr_backup_view AS
SELECT
    i.id as ipcr_id,
    i.title,
    i.status,
    p.employee_id as owner_employee_id,
    f.id as function_id,
    f.title as function_title,
    fc.id as category_id,
    fc.category,
    fsc.id as subcategory_id,
    fsc.sub_category,
    ind.id as indicator_id,
    ind.final_output,
    ind.success_indicator,
    ind.actual_accomplishments,
    ind.quality_rating,
    ind.efficiency_rating,
    ind.timeliness_rating,
    ind.average_rating
FROM
    ipcr i
    LEFT JOIN profiles p ON i.owner_id = p.id
    LEFT JOIN ipcr_function f ON i.id = f.ipcr_id
    LEFT JOIN ipcr_function_category fc ON f.id = fc.ipcr_function_id
    LEFT JOIN ipcr_function_sub_category fsc ON fc.id = fsc.ipcr_function_category_id
    LEFT JOIN ipcr_indicator ind ON (
        ind.ipcr_function_id = f.id
        OR ind.ipcr_function_category_id = fc.id
        OR ind.ipcr_function_sub_category_id = fsc.id
    );

GRANT
SELECT
    ON ipcr_backup_view TO authenticated;