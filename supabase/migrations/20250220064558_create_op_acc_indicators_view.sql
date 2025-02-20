CREATE
OR REPLACE VIEW op_acc_indicators_view AS
SELECT
    op.id AS operational_plan_id,
    ar.id AS accomplishment_report_id,
    opi.id AS op_activity_indicator_id,
    ari.id AS accomplishment_activity_indicator_id
FROM
    operational_plan op
    JOIN accomplishment_report ar ON ar.title = op.title
    AND -- Match the same title
    ar.unit_id = op.unit_id
    AND COALESCE(ar.office_id, 0) = COALESCE(op.office_id, 0)
    AND COALESCE(ar.program_id, 0) = COALESCE(op.program_id, 0)
    AND ar.implementing_unit = op.implementing_unit
    AND -- Match the same implementing unit
    ar.review_by = op.review_by
    AND -- Match the same reviewer
    ar.reviewer_position = op.reviewer_position
    AND ar.approve_by = op.approve_by
    AND -- Match the same approver
    ar.approver_position = op.approver_position
    JOIN op_header oph ON op.id = oph.operational_plan_id
    JOIN op_annual_plan opap ON oph.id = opap.op_header_id
    JOIN op_activity opa ON opap.id = opa.op_annual_plan_id
    JOIN op_activity_indicator opi ON opa.id = opi.op_activity_id
    JOIN accomplishment_header arh ON ar.id = arh.accomplishment_report_id
    JOIN accomplishment_annual_plan arap ON arh.id = arap.accomplishment_header_id
    JOIN accomplishment_activity ara ON arap.id = ara.accomplishment_annual_plan_id
    JOIN accomplishment_activity_indicator ari ON ara.id = ari.accomplishment_activity_id
WHERE
    oph.position = arh.position
    AND opap.position = arap.position
    AND opa.position = ara.position
    AND opi.position = ari.position;

-- Grant necessary permissions
GRANT
SELECT
    ON op_acc_indicators_view TO authenticated;