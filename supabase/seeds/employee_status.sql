INSERT INTO public.employee_status (type) VALUES
    ('Permanent'),
    ('Temporary'),
    ('Contractual')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());
