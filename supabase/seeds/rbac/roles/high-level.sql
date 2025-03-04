-- Insert roles
INSERT INTO
    roles (name)
VALUES
    ('director'),
    ('president'),
    ('vice-president') ON CONFLICT (name) DO NOTHING;