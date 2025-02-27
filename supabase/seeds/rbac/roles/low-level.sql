-- Insert roles
INSERT INTO
    roles (name)
VALUES
    ('head_of_operating_unit'),
    ('head_of_office'),
    ('dean'),
    ('program_chair'),
    ('faculty'),
    ('staff'),
    ('system_admin') ON CONFLICT (name) DO NOTHING;