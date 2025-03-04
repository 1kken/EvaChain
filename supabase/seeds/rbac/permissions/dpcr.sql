INSERT INTO
    permissions (name, description)
VALUES
    ('create_dpcr', 'Create DPCR ') ON CONFLICT (name) DO NOTHING;