-- Seed data for accomplishment_annual_plan table
INSERT INTO
    accomplishment_annual_plan (
        id,
        accomplishment_header_id,
        description,
        position,
        created_at,
        updated_at
    )
VALUES
    -- Annual Plan for Header 1: Instruction (1 plan)
    (
        'b5eb9a6d-1c2f-4fab-8071-ae5a5f5c6e01',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'Enhance curriculum development and implementation',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Annual Plans for Header 2: Research (3 plans)
    (
        'c6eb9a6d-1c2f-4fab-8071-ae5a5f5c6e02',
        'b47ac10b-58cc-4372-a567-0e02b2c3d480',
        'Increase research publications in indexed journals',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'c7eb9a6d-1c2f-4fab-8071-ae5a5f5c6e03',
        'b47ac10b-58cc-4372-a567-0e02b2c3d480',
        'Strengthen research collaboration with industry partners',
        2,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'c8eb9a6d-1c2f-4fab-8071-ae5a5f5c6e04',
        'b47ac10b-58cc-4372-a567-0e02b2c3d480',
        'Develop research capacity building programs',
        3,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Annual Plans for Header 3: Management and Governance (4 plans)
    (
        'd1eb9a6d-1c2f-4fab-8071-ae5a5f5c6e05',
        'c47ac10b-58cc-4372-a567-0e02b2c3d481',
        'Implement strategic planning initiatives',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'd2eb9a6d-1c2f-4fab-8071-ae5a5f5c6e06',
        'c47ac10b-58cc-4372-a567-0e02b2c3d481',
        'Enhance administrative efficiency and effectiveness',
        2,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'd3eb9a6d-1c2f-4fab-8071-ae5a5f5c6e07',
        'c47ac10b-58cc-4372-a567-0e02b2c3d481',
        'Strengthen policy development and implementation',
        3,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'd4eb9a6d-1c2f-4fab-8071-ae5a5f5c6e08',
        'c47ac10b-58cc-4372-a567-0e02b2c3d481',
        'Improve resource allocation and management',
        4,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Annual Plans for Header 4: Extension (2 plans)
    (
        'e1eb9a6d-1c2f-4fab-8071-ae5a5f5c6e09',
        'd47ac10b-58cc-4372-a567-0e02b2c3d482',
        'Develop community outreach programs',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'e2eb9a6d-1c2f-4fab-8071-ae5a5f5c6e10',
        'd47ac10b-58cc-4372-a567-0e02b2c3d482',
        'Implement service-learning initiatives',
        2,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Annual Plans for Header 5: Linkages and Collaboration (3 plans)
    (
        'f1eb9a6d-1c2f-4fab-8071-ae5a5f5c6e11',
        'e47ac10b-58cc-4372-a567-0e02b2c3d483',
        'Establish international academic partnerships',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'f2eb9a6d-1c2f-4fab-8071-ae5a5f5c6e12',
        'e47ac10b-58cc-4372-a567-0e02b2c3d483',
        'Develop industry-academia collaboration programs',
        2,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'f3eb9a6d-1c2f-4fab-8071-ae5a5f5c6e13',
        'e47ac10b-58cc-4372-a567-0e02b2c3d483',
        'Foster research collaborations with partner institutions',
        3,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Annual Plans for Header 6: Student Services and Development (2 plans)
    (
        'a1eb9a6d-1c2f-4fab-8071-ae5a5f5c6e14',
        'f47ac10b-58cc-4372-a567-0e02b2c3d484',
        'Enhance student support services',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'a2eb9a6d-1c2f-4fab-8071-ae5a5f5c6e15',
        'f47ac10b-58cc-4372-a567-0e02b2c3d484',
        'Implement career development programs',
        2,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    -- Annual Plans for Header 7: Alumni Relations (3 plans)
    (
        'b1eb9a6d-1c2f-4fab-8071-ae5a5f5c6e16',
        'a47ac10b-58cc-4372-a567-0e02b2c3d485',
        'Strengthen alumni network and engagement',
        1,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'b2eb9a6d-1c2f-4fab-8071-ae5a5f5c6e17',
        'a47ac10b-58cc-4372-a567-0e02b2c3d485',
        'Develop alumni mentorship programs',
        2,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    ),
    (
        'b3eb9a6d-1c2f-4fab-8071-ae5a5f5c6e18',
        'a47ac10b-58cc-4372-a567-0e02b2c3d485',
        'Create alumni career development initiatives',
        3,
        '2024-01-01 08:00:00+00',
        '2024-01-01 08:00:00+00'
    );