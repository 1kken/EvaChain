-- Add required operational plan hierarchy
INSERT INTO
    op_header (id, operational_plan_id, position, title)
VALUES
    (
        '123e4567-e89b-12d3-a456-426614174000',
        'e99f935f-19c6-4d0e-9d7f-54c5b96f9db7',
        1,
        'Instruction'
    );

-- (
--     '123e4567-e89b-12d3-a456-426614174001',
--     'e99f935f-19c6-4d0e-9d7f-54c5b96f9db7',
--     2,
--     'Research'
-- ),
-- (
--     '123e4567-e89b-12d3-a456-426614174002',
--     'e99f935f-19c6-4d0e-9d7f-54c5b96f9db7',
--     3,
--     'Extension and Community Management'
-- ),
-- --JUST FOR THE SEEDING FOR IPCR
-- (
--     'c392f75c-6f4e-4e34-a91e-6b1c7a590d4d',
--     'b392f75c-6f4e-4e34-a91e-6b1c7a590d4d',
--     1,
--     'TEST PRINTING IPCR'
-- );