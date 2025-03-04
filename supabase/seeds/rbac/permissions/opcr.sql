INSERT INTO
    permissions (name, description)
VALUES
    ('create_opcr', 'Create OPCR ') ON CONFLICT (name) DO NOTHING;