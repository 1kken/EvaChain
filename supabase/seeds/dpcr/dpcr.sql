-- Seed data for DPCR table
INSERT INTO
    dpcr (
        id,
        title,
        review_by,
        reviewer_position,
        owner_id,
        unit_id,
        office_id,
        program_id,
        created_at,
        updated_at
    )
VALUES
    (
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'DPCR 2025 - SLUC',
        'Dr. Jane Smith',
        'President',
        '3d9b104f-f948-40d5-9626-072e890903f7', --creator id
        2, -- unit_id (from profile)
        9, -- office_id (from profile)
        1, -- program_id (from profile)
        NOW (),
        NOW ()
    );