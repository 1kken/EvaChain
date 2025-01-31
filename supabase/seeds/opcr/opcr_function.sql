-- Seed data for DPCR Functions
INSERT INTO
    opcr_function (
        id,
        opcr_id,
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