-- Seed IPCR Function Sub-Categories
INSERT INTO
    ipcr_function_sub_category (
        id,
        ipcr_function_category_id,
        sub_category,
        position
    )
VALUES
    -- Under Higher Education Services (c1234567-1234-5678-1234-567812345678)
    (
        'b392f75c-6f4e-4e34-a91e-6b1c7a590d3d',
        'c1234567-1234-5678-1234-567812345678',
        'Instructional Imperatives',
        1
    ),
    -- Under Advanced Education Services (c2345678-2345-6789-2345-678923456789)
    (
        'e2d4f6a8-1234-5678-90ab-cdef12345678',
        'c2345678-2345-6789-2345-678923456789',
        'Instructional Imperatives',
        1
    );