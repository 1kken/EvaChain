-- Insert sample operational plan activity (required for indicators)
INSERT INTO
    operational_plan (
        id,
        creator_id,
        unit_id,
        office_id,
        program_id,
        title,
        implementing_unit
    )
VALUES
    (
        'b392f75c-6f4e-4e34-a91e-6b1c7a590d4d',
        '3d9b104f-f948-40d5-9626-072e890903f7',
        2,
        9,
        1,
        'TEST PRINTING IPCR',
        'TEST PRINTING IPCR'
    );