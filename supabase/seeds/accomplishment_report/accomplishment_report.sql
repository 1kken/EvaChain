-- Seed data for accomplishment_report table
INSERT INTO
    accomplishment_report (
        id,
        title,
        implementing_unit,
        owner_id,
        unit_id,
        office_id,
        program_id,
        review_by,
        reviewer_position,
        approve_by,
        approver_position,
        created_at,
        updated_at
    )
VALUES
    -- Sample 1: Unit Level Report
    (
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        'Academic Affairs Accomplishment Report 2024',
        'Office of Academic Affairs',
        '3d9b104f-f948-40d5-9626-072e890903f7', --creator id
        2, -- unit_id (from profile)
        9, -- office_id (from profile)
        1, -- program_id (from profile)
        'Dr. Maria Santos',
        'Vice President for Academic Affairs',
        'Dr. James Martinez',
        'University President',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    );