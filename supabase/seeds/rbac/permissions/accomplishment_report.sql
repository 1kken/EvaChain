INSERT INTO
    permissions (name, description)
VALUES
    (
        'create_accomplishment_report',
        'Create Accomplishment Report'
    ) ON CONFLICT (name) DO NOTHING;