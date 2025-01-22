-- Seed data for accomplishment_header table
INSERT INTO
    accomplishment_header (
        id,
        accomplishment_report_id,
        position,
        title,
        created_at,
        updated_at
    )
VALUES
    -- Header 1: Instruction
    (
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        1,
        'Instruction',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Header 2: Research
    (
        'b47ac10b-58cc-4372-a567-0e02b2c3d480',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        2,
        'Research',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Header 3: Management and Governance
    (
        'c47ac10b-58cc-4372-a567-0e02b2c3d481',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        3,
        'Management and Governance',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Header 4: Extension
    (
        'd47ac10b-58cc-4372-a567-0e02b2c3d482',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        4,
        'Extension',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Header 5: Linkages and Collaboration
    (
        'e47ac10b-58cc-4372-a567-0e02b2c3d483',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        5,
        'Linkages and Collaboration',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Header 6: Student Services and Development
    (
        'f47ac10b-58cc-4372-a567-0e02b2c3d484',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        6,
        'Student Services and Development',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Header 7: Alumni Relations
    (
        'a47ac10b-58cc-4372-a567-0e02b2c3d485',
        'a1b2c3d4-e5f6-4321-a123-426614174000',
        7,
        'Alumni Relations',
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    );