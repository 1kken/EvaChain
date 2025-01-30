INSERT INTO
    strategy_plan_performance_indicator (
        id,
        strategy_plan_id,
        performance_indicator,
        input_type,
        base_target,
        actual_target,
        concerned_offices,
        position
    )
VALUES
    -- Instruction Strategy 1 (2 indicators)
    (
        '94975062-72ae-414b-b86e-b639fc2feaef',
        'a1b2c3d4-e5f6-4718-9abc-123456789abc',
        'Percentage of courses implementing active learning methodologies',
        'percentage',
        '60%',
        '85%',
        'Academic Affairs',
        1
    ),
    (
        '04043f69-6a1a-4100-871a-d7d0b1e2ca24',
        'a1b2c3d4-e5f6-4718-9abc-123456789abc',
        'Number of faculty trained in innovative teaching methods',
        'number',
        '20',
        '40',
        'Faculty Development',
        2
    ),
    -- Instruction Strategy 2 (1 indicator)
    (
        'b6776473-b5f8-473c-a7de-600f0fe70b31',
        'b2c3d4e5-f6a7-4829-0bcd-234567890abc',
        'Percentage of courses with industry-aligned content',
        'percentage',
        '50%',
        '80%',
        'Academic Affairs',
        1
    ),
    -- Instruction Strategy 3 (4 indicators)
    (
        '1cf5f7e1-6206-4d20-acce-1741b0a6d8f5',
        'c3d4e5f6-a7b8-493a-1cde-345678901abc',
        'Percentage of courses using LMS effectively',
        'percentage',
        '70%',
        '95%',
        'IT Department',
        1
    ),
    (
        '9e1d0485-c7b9-4f66-9f12-88ecdab96e36',
        'c3d4e5f6-a7b8-493a-1cde-345678901abc',
        'Number of smart classrooms established',
        'number',
        '10',
        '25',
        'IT Department',
        2
    ),
    (
        'd07c44fa-5d10-4e1a-a98a-a0190be91796',
        'c3d4e5f6-a7b8-493a-1cde-345678901abc',
        'Student satisfaction with technology integration',
        'ratio',
        '3.5:5',
        '4.5:5',
        'IT Department',
        3
    ),
    (
        '521b2ce5-c941-40c7-8ed0-f158b91b8ff4',
        'c3d4e5f6-a7b8-493a-1cde-345678901abc',
        'Faculty technology competency rating',
        'ratio',
        '3:5',
        '4:5',
        'IT Department',
        4
    ),
    -- Instruction Strategy 4 (2 indicators)
    (
        '7634c323-9300-4d47-abee-c51ae6dea509',
        'd4e5f6a7-b8c9-404b-2def-456789012abc',
        'Student satisfaction with learning experience',
        'ratio',
        '3.5:5',
        '4.5:5',
        'Academic Affairs',
        1
    ),
    (
        '11e38047-51a0-49bf-b15d-1f1ab6802b84',
        'd4e5f6a7-b8c9-404b-2def-456789012abc',
        'Implementation rate of student-centered methodologies',
        'percentage',
        '60%',
        '90%',
        'Academic Affairs',
        2
    ),
    -- Instruction Strategy 5 (1 indicator)
    (
        'dea053d4-5089-4e08-94de-b649f92851da',
        'e5f6a7b8-c9d0-415c-3efa-567890123abc',
        'Percentage of faculty with advanced degrees',
        'percentage',
        '70%',
        '90%',
        'Human Resources',
        1
    );