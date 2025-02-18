CREATE
OR REPLACE VIEW accomplishment_report_backup_view AS
SELECT
    ar.id as accomplishment_report_id,
    ar.title as accomplishment_report_title,
    ar.implementing_unit,
    ar.review_by,
    ar.reviewer_position,
    ar.approve_by,
    ar.approver_position,
    -- Owner details
    p.id as owner_id,
    p.employee_id as owner_employee_id,
    p.first_name as owner_first_name,
    p.middle_name as owner_middle_name,
    p.last_name as owner_last_name,
    p.email as owner_email,
    pos.name as owner_position_name,
    now_type.type as owner_nature_of_work,
    emp_status.type as owner_employee_status,
    -- Owner organization details
    owner_unit.id as owner_unit_id,
    owner_unit.code as owner_unit_code,
    owner_unit.name as owner_unit_name,
    owner_office.id as owner_office_id,
    owner_office.code as owner_office_code,
    owner_office.name as owner_office_name,
    owner_program.id as owner_program_id,
    owner_program.name as owner_program_name,
    -- AR organization details
    ar_unit.id as ar_unit_id,
    ar_unit.code as ar_unit_code,
    ar_unit.name as ar_unit_name,
    ar_office.id as ar_office_id,
    ar_office.code as ar_office_code,
    ar_office.name as ar_office_name,
    ar_program.id as ar_program_id,
    ar_program.name as ar_program_name,
    -- Hierarchy details
    h.id as header_id,
    h.title as header_title,
    h.position as header_position,
    ap.id as annual_plan_id,
    ap.description as annual_plan_description,
    ap.position as annual_plan_position,
    -- Activity details
    act.id as activity_id,
    act.activity,
    act.input_type,
    act.performance_indicator,
    act.annual_target,
    act.q1_accomplishment,
    act.q2_accomplishment,
    act.q3_accomplishment,
    act.q4_accomplishment,
    act.total,
    act.accomplishment_rate,
    act.responsible_officer_unit,
    act.remarks as activity_remarks,
    act.position as activity_position,
    -- Related IPCR indicators
    (
        SELECT
            json_agg (
                json_build_object (
                    'indicator_id',
                    i.id,
                    'final_output',
                    i.final_output,
                    'success_indicator',
                    i.success_indicator,
                    'accomplishments',
                    (
                        SELECT
                            json_agg (
                                json_build_object (
                                    'id',
                                    ia.id,
                                    'actual_accomplishments',
                                    ia.actual_accomplishments,
                                    'quantity',
                                    ia.quantity
                                )
                            )
                        FROM
                            ipcr_indicator_accomplishment ia
                        WHERE
                            ia.ipcr_indicator_id = i.id
                    )
                )
            )
        FROM
            ipcr_indicator i
        WHERE
            EXISTS (
                SELECT
                    1
                FROM
                    ipcr ipcr_parent
                WHERE
                    get_ipcr_id_from_indicator (i.id) = ipcr_parent.id
                    AND (ar.unit_id = ipcr_parent.unit_id)
                    AND (
                        ar.office_id IS NULL
                        OR ar.office_id = ipcr_parent.office_id
                    )
                    AND (
                        ar.program_id IS NULL
                        OR ar.program_id = ipcr_parent.program_id
                    )
            )
    ) as related_ipcr_indicators,
    ar.created_at,
    ar.updated_at
FROM
    accomplishment_report ar
    LEFT JOIN profiles p ON ar.owner_id = p.id
    LEFT JOIN position pos ON p.position_id = pos.id
    LEFT JOIN nature_of_work now_type ON p.nature_of_work_id = now_type.id
    LEFT JOIN employee_status emp_status ON p.employee_status_id = emp_status.id
    LEFT JOIN unit owner_unit ON p.unit_id = owner_unit.id
    LEFT JOIN office owner_office ON p.office_id = owner_office.id
    LEFT JOIN program owner_program ON p.program_id = owner_program.id
    LEFT JOIN unit ar_unit ON ar.unit_id = ar_unit.id
    LEFT JOIN office ar_office ON ar.office_id = ar_office.id
    LEFT JOIN program ar_program ON ar.program_id = ar_program.id
    LEFT JOIN accomplishment_header h ON ar.id = h.accomplishment_report_id
    LEFT JOIN accomplishment_annual_plan ap ON h.id = ap.accomplishment_header_id
    LEFT JOIN accomplishment_activity act ON ap.id = act.accomplishment_annual_plan_id;

GRANT
SELECT
    ON accomplishment_report_backup_view TO authenticated;