-- create admin role
INSERT INTO
    roles (name)
VALUES
    ('admin') ON CONFLICT (name) DO NOTHING;