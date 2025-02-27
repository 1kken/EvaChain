INSERT INTO
    permissions (name, description)
VALUES
    (
        'program_view_ipcr',
        'View IPCRs at program level'
    ),
    ('office_view_ipcr', 'View IPCRs at office level'),
    ('unit_view_ipcr', 'View IPCRs at unit level') ON CONFLICT (name) DO NOTHING;