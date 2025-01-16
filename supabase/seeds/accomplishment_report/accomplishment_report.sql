-- First, create the accomplishment report
INSERT INTO
    accomplishment_report (
        id,
        implementing_unit,
        title,
        status,
        owner_id,
        unit_id,
        office_id,
        program_id
    )
VALUES
    (
        'a1b2c3d4-e5f6-4789-89ab-c1d2e3f4a5b6',
        'Test Implementing Unit',
        'Q4 2024 Accomplishment Report',
        'draft',
        '3d9b104f-f948-40d5-9626-072e890903f7',
        2,
        9,
        1
    );