-- create admin role
INSERT INTO
    roles (name)
VALUES
    ('admin') ON CONFLICT (name) DO NOTHING;

INSERT INTO
    roles (name)
VALUES
    ('head_of_unit') ON CONFLICT (name) DO NOTHING;