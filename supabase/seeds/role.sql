-- create admin role
INSERT INTO
    roles (name)
VALUES
    ('system_admin') ON CONFLICT (name) DO NOTHING;

--create chairman role
INSERT INTO
    roles (name)
VALUES
    ('chairman') ON CONFLICT (name) DO NOTHING;

--create dean role
INSERT INTO
    roles (name)
VALUES
    ('dean') ON CONFLICT (name) DO NOTHING;