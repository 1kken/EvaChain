-- Seed data for DPCR assessors
INSERT INTO
    dpcr_assessor (
        id,
        dpcr_id,
        name,
        position,
        sequence,
        created_at,
        updated_at
    )
VALUES
    -- First Assessor - President
    (
        'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Dr. Jane Smith',
        'President',
        1,
        NOW (),
        NOW ()
    ),
    -- Second Assessor - Vice President for Academic Affairs
    (
        'b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Dr. Robert Johnson',
        'Vice President for Academic Affairs',
        2,
        NOW (),
        NOW ()
    ),
    -- Third Assessor - Dean of College
    (
        'c3d4e5f6-a7b8-6c7d-0e9f-1a2b3c4d5e6f',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Dr. Maria Garcia',
        'Dean, College of Science',
        3,
        NOW (),
        NOW ()
    ),
    -- Fourth Assessor - Department Chair
    (
        'd4e5f6a7-b8c9-7d8e-1f0a-2b3c4d5e6f7a',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Dr. James Wilson',
        'Department Chair',
        4,
        NOW (),
        NOW ()
    ),
    -- Fifth Assessor - Program Head
    (
        'e5f6a7b8-c9d0-8e9f-2a1b-3c4d5e6f7a8b',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Dr. Sarah Lee',
        'Program Head',
        5,
        NOW (),
        NOW ()
    );