--  Employee Status Seeder
INSERT INTO public.employee_status (type) VALUES
    ('Permanent'),
    ('Contractual'),
    ('Probationary'),
    ('Temporary'),
    ('Part-Time')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());
