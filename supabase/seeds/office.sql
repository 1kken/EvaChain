-- Office Seeder (Using a subquery to get unit_ids)
INSERT INTO public.office (unit_id, code, name) VALUES
    -- NLUC offices
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'CAS', 'College of Arts and Sciences'),
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'CVM', 'College of Veterinary Medicine'),
    ((SELECT id FROM public.unit WHERE code = 'NLUC'), 'IES', 'Institute of Environmental Studies'),

    -- MLUC offices
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'COE', 'College of Engineering'),
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'CIT', 'College of Information Technology'),
    ((SELECT id FROM public.unit WHERE code = 'MLUC'), 'COL', 'College of Law'),

    -- SLUC offices
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CM', 'College of Medicine'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCHAMS', 'College of Community Health & Allied Medical Sciences'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCS', 'College of Computer Science'),
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'Admin', 'Rektor Office')

ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        unit_id = EXCLUDED.unit_id,
        updated_at = timezone('utc'::text, now());