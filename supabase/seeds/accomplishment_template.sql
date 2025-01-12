
--************DONT DELETE************
--for accomplishment report 
INSERT INTO accomplishment_report_template (
    is_published,
    created_at,
    updated_at
) VALUES (
    FALSE,                              -- Setting as published
    TIMEZONE('utc'::text, NOW()),     -- Current timestamp
    TIMEZONE('utc'::text, NOW())      -- Current timestamp
);

