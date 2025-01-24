-- Seed data for DPCR Function Categories
INSERT INTO
    dpcr_function_category (
        id,
        dpcr_function_id,
        category,
        position,
        created_at,
        updated_at
    )
VALUES
    (
        '9a1b2c3d-4e5f-4671-8912-0a1b2c3d4e5f', -- Valid UUID
        'a7b9c456-8d2e-4f3a-bc12-d3e4f5a6b7c8', -- Core Function ID
        'Higher Education Services',
        1,
        NOW (),
        NOW ()
    ),
    (
        'b2c3d4e5-f678-4891-9012-1a2b3c4d5e6f', -- Valid UUID
        'a7b9c456-8d2e-4f3a-bc12-d3e4f5a6b7c8',
        'Advanced Education Services',
        2,
        NOW (),
        NOW ()
    ),
    (
        'c3d4e5f6-6718-4910-9112-2b3c4d5e6f7a', -- Valid UUID
        'a7b9c456-8d2e-4f3a-bc12-d3e4f5a6b7c8',
        'Research Services',
        3,
        NOW (),
        NOW ()
    ),
    (
        'd4e5f6a7-8912-4012-1113-3c4d5e6f7a8b', -- Valid UUID
        'a7b9c456-8d2e-4f3a-bc12-d3e4f5a6b7c8',
        'Extension Services',
        4,
        NOW (),
        NOW ()
    ),
    (
        'e5f6a7b8-9012-4314-1314-4d5e6f7a8b9c', -- Valid UUID
        'a7b9c456-8d2e-4f3a-bc12-d3e4f5a6b7c8',
        'Administrative and Strategic Function',
        5,
        NOW (),
        NOW ()
    );