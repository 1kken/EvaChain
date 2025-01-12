-- Seed IPCR Function Categories CORE FUNCTION
INSERT INTO
    ipcr_function_category (
        id,
        ipcr_function_id,
        category,
        unit,
        immediate_supervisor_id,
        position
    )
VALUES
    (
        'c1234567-1234-5678-1234-567812345678',
        'f1234567-1234-5678-1234-567812345678',
        'Higher Education Services',
        21.00,
        '9a4ba6de-9fc0-4110-8445-f9a1efbc1432',
        1
    ),
    (
        'c2345678-2345-6789-2345-678923456789',
        'f1234567-1234-5678-1234-567812345678',
        'Advanced Education Services',
        4.50,
        'c92ae2f1-88c3-40b5-b336-84e69b4e18a6',
        2
    ),
    (
        'c3456789-3456-7890-3456-789034567890',
        'f1234567-1234-5678-1234-567812345678',
        'Research Services',
        1.00,
        'c92ae2f1-88c3-40b5-b336-84e69b4e18a6',
        3
    ),
    (
        'c4567890-4567-8901-4567-890145678901',
        'f1234567-1234-5678-1234-567812345678',
        'Technical Advisory and Extension Services',
        1.00,
        'c92ae2f1-88c3-40b5-b336-84e69b4e18a6',
        4
    ),
    (
        'c5678901-5678-9012-5678-901256789012',
        'f1234567-1234-5678-1234-567812345678',
        'Administrative Designation',
        12.00,
        '9a4ba6de-9fc0-4110-8445-f9a1efbc1432',
        5
    );