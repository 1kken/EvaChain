INSERT INTO
    sdg_alignment (
        id,
        strat_plan_objective_id,
        strat_plan_performance_indicator_id
    )
VALUES
    -- Alignments for "Percentage of courses implementing active learning methodologies"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '94975062-72ae-414b-b86e-b639fc2feaef'
    ),
    (
        uuid_generate_v4 (),
        'b2c3d4e5-f6a7-4b2c-9d3e-4f5a6b7c8d9e', -- Employment rate objective
        '94975062-72ae-414b-b86e-b639fc2feaef'
    ),
    -- Alignments for "Number of faculty trained in innovative teaching methods"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '04043f69-6a1a-4100-871a-d7d0b1e2ca24'
    ),
    (
        uuid_generate_v4 (),
        'c3d4e5f6-a7b8-4c3d-ae4f-5a6b7c8d9e0f', -- Student-faculty ratio objective
        '04043f69-6a1a-4100-871a-d7d0b1e2ca24'
    ),
    -- Alignments for "Percentage of courses with industry-aligned content"
    (
        uuid_generate_v4 (),
        'b2c3d4e5-f6a7-4b2c-9d3e-4f5a6b7c8d9e', -- Employment rate objective
        'b6776473-b5f8-473c-a7de-600f0fe70b31'
    ),
    -- Alignments for "Percentage of courses using LMS effectively"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '1cf5f7e1-6206-4d20-acce-1741b0a6d8f5'
    ),
    (
        uuid_generate_v4 (),
        'd4e5f6a7-b8c9-4d4e-bf5a-6b7c8d9e0f1a', -- Equity group objective
        '1cf5f7e1-6206-4d20-acce-1741b0a6d8f5'
    ),
    -- Alignments for "Number of smart classrooms established"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '9e1d0485-c7b9-4f66-9f12-88ecdab96e36'
    ),
    (
        uuid_generate_v4 (),
        'd4e5f6a7-b8c9-4d4e-bf5a-6b7c8d9e0f1a', -- Equity group objective
        '9e1d0485-c7b9-4f66-9f12-88ecdab96e36'
    ),
    -- Alignments for "Student satisfaction with technology integration"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        'd07c44fa-5d10-4e1a-a98a-a0190be91796'
    ),
    -- Alignments for "Faculty technology competency rating"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '521b2ce5-c941-40c7-8ed0-f158b91b8ff4'
    ),
    (
        uuid_generate_v4 (),
        'c3d4e5f6-a7b8-4c3d-ae4f-5a6b7c8d9e0f', -- Student-faculty ratio objective
        '521b2ce5-c941-40c7-8ed0-f158b91b8ff4'
    ),
    -- Alignments for "Student satisfaction with learning experience"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '7634c323-9300-4d47-abee-c51ae6dea509'
    ),
    (
        uuid_generate_v4 (),
        'd4e5f6a7-b8c9-4d4e-bf5a-6b7c8d9e0f1a', -- Equity group objective
        '7634c323-9300-4d47-abee-c51ae6dea509'
    ),
    -- Alignments for "Implementation rate of student-centered methodologies"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        '11e38047-51a0-49bf-b15d-1f1ab6802b84'
    ),
    (
        uuid_generate_v4 (),
        'c3d4e5f6-a7b8-4c3d-ae4f-5a6b7c8d9e0f', -- Student-faculty ratio objective
        '11e38047-51a0-49bf-b15d-1f1ab6802b84'
    ),
    -- Alignments for "Percentage of faculty with advanced degrees"
    (
        uuid_generate_v4 (),
        'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', -- Passing rate objective
        'dea053d4-5089-4e08-94de-b649f92851da'
    ),
    (
        uuid_generate_v4 (),
        'c3d4e5f6-a7b8-4c3d-ae4f-5a6b7c8d9e0f', -- Student-faculty ratio objective
        'dea053d4-5089-4e08-94de-b649f92851da'
    );