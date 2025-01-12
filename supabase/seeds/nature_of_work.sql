-- 2. Nature of Work Seeder
INSERT INTO public.nature_of_work (type) VALUES
    ('Teaching'),
    ('Non-Teaching')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());