INSERT INTO
    op_activity (
        id,
        op_objective_id,
        activity,
        indicator,
        former_state,
        desired_state,
        q1,
        q2,
        q3,
        q4,
        entity_responsible,
        position
    )
VALUES
    --JUST FOR THE SEEDING FOR IPCR
    (
        'f392f75c-6f4e-4e34-a91e-6b1c7a590d4d',
        'e392f75c-6f4e-4e34-a91e-6b1c7a590d4d',
        'TEST PRINTING IPCR',
        'TEST PRINTING IPCR',
        'TEST PRINTING IPCR',
        'TEST PRINTING IPCR',
        true,
        true,
        true,
        true,
        'TEST PRINTING IPCR',
        1
    );