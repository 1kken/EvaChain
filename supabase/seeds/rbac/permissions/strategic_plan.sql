INSERT INTO
    permissions (name, description)
VALUES
    ('create_strategic_plan', 'Create strategic plan ') ON CONFLICT (name) DO NOTHING;