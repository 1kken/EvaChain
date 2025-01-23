-- IPCR SEEDER INDIVIDUAL ACCOUNT
-- Seed IPCR data
INSERT INTO
    ipcr (
        id,
        title,
        status,
        head_of_operating_unit,
        program_chair,
        dean,
        owner_id,
        unit_id,
        office_id,
        program_id
    )
VALUES
    (
        '12345678-1234-5678-1234-567812345678',
        'IPCR for First Semester 2024',
        'draft',
        'JOANNE C. RIVERA',
        'RAYMUND E. DILAN',
        'ENRICO G. DACANAY',
        '3d9b104f-f948-40d5-9626-072e890903f7', -- owner_id (matches the profile)
        2, -- unit_id (from profile)
        9, -- office_id (from profile)
        1 -- program_id (from profile)
    );