INSERT INTO
    permissions (name, description)
VALUES
    (
        'program_create_operational_plan',
        'Create operational plan at program level'
    ),
    (
        'office_create_operational_plan',
        'Create operational plan at office level'
    ),
    (
        'unit_create_operational_plan',
        'Create operational plan at program level'
    ) ON CONFLICT (name) DO NOTHING;