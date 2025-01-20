-- Insert sample operational plan activity (required for indicators)
INSERT INTO
    operational_plan (
        id,
        creator_id,
        unit_id,
        office_id,
        program_id,
        title,
        implementing_unit,
        review_by,            -- Added field
        reviewer_position,    -- Added field
        approve_by,          -- Added field
        approver_position,   -- Added field
        created_at,
        updated_at
    )
VALUES
   --for printing
   (
        'e99f935f-19c6-4d0e-9d7f-54c5b96f9db7', -- id (UUID)
        '3d9b104f-f948-40d5-9626-072e890903f7', --creator id
        2, -- unit_id (from profile)
        9, -- office_id (from profile)
        1, -- program_id (from profile)
        'Annual Operational Plan 2025',  -- title
        'Research and Development Unit',  -- implementing_unit
        'PRISCILO P. FONTANILLA, JR.',  -- review_by
        'VP for Planning and development',  -- reviewer_position
        'JAIME I. MANUEL, JR.',
        'president',
        TIMEZONE('utc'::text, NOW()),  -- created_at
        TIMEZONE('utc'::text, NOW())   -- updated_at
    ),
    --JUST FOR THE SEEDING FOR IPCR
    (
        'b392f75c-6f4e-4e34-a91e-6b1c7a590d4d',
        '3d9b104f-f948-40d5-9626-072e890903f7',
        2,                                              -- unit_id
        9,                                              -- office_id
        1,                                              -- program_id
        'TEST PRINTING IPCR',                           -- title
        'TEST PRINTING IPCR',                           -- implementing_unit
        'Dr. Maria Santos',                             -- review_by
        'Department Head',                              -- reviewer_position
        'Dr. James Martinez',                           -- approve_by
        'College Dean',                                 -- approver_position
        TIMEZONE('utc', TIMESTAMP '2024-01-01' + random() * (TIMESTAMP '2024-12-31' - TIMESTAMP '2024-01-01')),
        TIMEZONE('utc', TIMESTAMP '2024-01-01' + random() * (TIMESTAMP '2024-12-31' - TIMESTAMP '2024-01-01'))
    );;