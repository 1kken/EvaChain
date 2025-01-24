-- Seed data for DPCR Functions
INSERT INTO
    dpcr_function (
        id,
        dpcr_id,
        title,
        position,
        created_at,
        updated_at
    )
VALUES
    (
        'a7b9c456-8d2e-4f3a-bc12-d3e4f5a6b7c8',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Core Function',
        1,
        NOW (),
        NOW ()
    ),
    (
        '97ebb7e6-be47-4552-b61f-64761ee82acb',
        'cf45e3a7-1cc5-4551-9911-67e550d0f6f3',
        'Support Function',
        2,
        NOW (),
        NOW ()
    );

-- Seed data for DPCR Indicators for Support Function
INSERT INTO
    dpcr_indicator (
        id,
        dpcr_function_id,
        dpcr_function_category_id,
        success_indicator,
        alloted_budget,
        division_individuals_accountable,
        physical_targets,
        actual_accomplishments,
        quality_rating,
        efficiency_rating,
        timeliness_rating,
        average_rating,
        remarks,
        position,
        created_at,
        updated_at
    )
VALUES
    (
        uuid_generate_v4 (),
        '97ebb7e6-be47-4552-b61f-64761ee82acb',
        NULL,
        'Enhance procurement processes for faster delivery',
        '300,000',
        'Procurement Department',
        'Reduce procurement cycle time to 10 days',
        'Procurement cycle time reduced to 9 days',
        4.7,
        4.8,
        4.6,
        ROUND((4.7 + 4.8 + 4.6) / 3, 2),
        'Process efficiency improved',
        1,
        NOW (),
        NOW ()
    ),
    (
        uuid_generate_v4 (),
        '97ebb7e6-be47-4552-b61f-64761ee82acb',
        NULL,
        'Improve IT support response time',
        '200,000',
        'IT Department',
        'Respond to 95% of IT tickets within 24 hours',
        '98% of IT tickets resolved within 24 hours',
        4.8,
        4.9,
        4.7,
        ROUND((4.8 + 4.9 + 4.7) / 3, 2),
        'Response time goal exceeded',
        2,
        NOW (),
        NOW ()
    ),
    (
        uuid_generate_v4 (),
        '97ebb7e6-be47-4552-b61f-64761ee82acb',
        NULL,
        'Optimize HR onboarding process',
        '250,000',
        'HR Department',
        'Complete onboarding for new hires within 7 days',
        'Average onboarding completed in 6 days',
        4.6,
        4.7,
        4.8,
        ROUND((4.6 + 4.7 + 4.8) / 3, 2),
        'Onboarding streamlined',
        3,
        NOW (),
        NOW ()
    ),
    (
        uuid_generate_v4 (),
        '97ebb7e6-be47-4552-b61f-64761ee82acb',
        NULL,
        'Increase office cleanliness satisfaction rating',
        '100,000',
        'Facilities Management',
        'Achieve 90% satisfaction in cleanliness surveys',
        '92% satisfaction reported in surveys',
        4.7,
        4.6,
        4.8,
        ROUND((4.7 + 4.6 + 4.8) / 3, 2),
        'Cleanliness goals met',
        4,
        NOW (),
        NOW ()
    ),
    (
        uuid_generate_v4 (),
        '97ebb7e6-be47-4552-b61f-64761ee82acb',
        NULL,
        'Implement paperless workflows for admin tasks',
        '400,000',
        'Administration Office',
        'Convert 80% of workflows to digital systems',
        '85% of workflows digitalized',
        4.8,
        4.7,
        4.9,
        ROUND((4.8 + 4.7 + 4.9) / 3, 2),
        'Paperless initiative successful',
        5,
        NOW (),
        NOW ()
    );