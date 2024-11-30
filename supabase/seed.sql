-- 1. Unit Seeder
INSERT INTO public.unit (code, name) VALUES
    ('OUS', 'Open University System'),
    ('SLUC', 'South La Union Campus'),
    ('MLUC', 'Middle La Union campus'),
    ('NLUC', 'North La Union Campus'),
    ('NARTDI', 'National Apiculture Reasearch Training and Development Institute')
ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        updated_at = timezone('utc'::text, now());

-- 2. Nature of Work Seeder
INSERT INTO public.nature_of_work (type) VALUES
    ('Teaching'),
    ('Non-Teaching')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());

-- 3. Office Seeder (Using a subquery to get unit_ids)
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
    ((SELECT id FROM public.unit WHERE code = 'SLUC'), 'CCS', 'College of Computer Science')
ON CONFLICT (code) DO UPDATE 
    SET name = EXCLUDED.name,
        unit_id = EXCLUDED.unit_id,
        updated_at = timezone('utc'::text, now());

-- 4. Programme Seeder (Using subqueries to get unit_ids and office_ids)
INSERT INTO public.program (unit_id, office_id, name) VALUES
    -- SLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCS'),
     'Bachelor of Science in Computer Science'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCHAMS'),
     'Bachelor of Science in Nursing'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CCHAMS'),
     'Bachelor of Science in Midwifery'),
    
    ((SELECT id FROM public.unit WHERE code = 'SLUC'),
     (SELECT id FROM public.office WHERE code = 'CM'),
     'Doctor of Medicine'),

    -- MLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COL'),
     'Juris Doctor'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'CIT'),
     'Master in Information Technology'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'CIT'),
     'Bachelor of Science in Information Technology'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COE'),
     'Bachelor of Science in Electrical Engineering'),
    
    ((SELECT id FROM public.unit WHERE code = 'MLUC'),
     (SELECT id FROM public.office WHERE code = 'COE'),
     'Bachelor of Science in Mechanical Engineering'),

    -- NLUC Programmes
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'IES'),
     'Bachelor of Science in Environmental Science'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CVM'),
     'Doctor of Veterinary Medicine'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CAS'),
     'Bachelor of Science in Biology'),
    
    ((SELECT id FROM public.unit WHERE code = 'NLUC'),
     (SELECT id FROM public.office WHERE code = 'CAS'),
     'Bachelor of Science in English Language')
ON CONFLICT DO NOTHING;

-- 5. Position Seeder (Using subquery to get nature_of_work_id)
INSERT INTO public.position (nature_of_work_id, name) VALUES
    -- Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Instructor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor'),

    -- Non-Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Administrative Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Records Officer'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Library Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Laboratory Technician')
ON CONFLICT (name) DO UPDATE 
    SET nature_of_work_id = EXCLUDED.nature_of_work_id,
        updated_at = timezone('utc'::text, now());

-- 6. Employee Status Seeder
INSERT INTO public.employee_status (type) VALUES
    ('Permanent'),
    ('Contractual'),
    ('Probationary'),
    ('Temporary'),
    ('Part-Time')
ON CONFLICT (type) DO UPDATE 
    SET updated_at = timezone('utc'::text, now());

-- create admin role
INSERT INTO roles (name) 
VALUES ('system_admin')
ON CONFLICT (name) DO NOTHING;

-- seed admin,individual user
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '22eb2885-4e6b-4558-bfc0-9feae34e8844', 'authenticated', 'authenticated', 'admin@dmmmsu.edu.ph', '$2a$10$U3JqJsuGSruaURhgjztjIujSLycL/bX49.3QRNjqz12IdJQW4Q/9O', '2024-11-30 11:34:22.219117+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-30 13:39:54.432218+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "22eb2885-4e6b-4558-bfc0-9feae34e8844", "email": "admin@dmmmsu.edu.ph", "last_name": "user", "first_name": "admin", "email_verified": false, "phone_verified": false}', NULL, '2024-11-30 11:34:22.209783+00', '2024-11-30 13:39:54.434587+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '12b5599e-364f-4e9d-8727-08b8f7aaf3c7', 'authenticated', 'authenticated', 'individual@dmmmsu.edu.ph', '$2a$10$wKaq5JDb/QPGzfugIgmsXOQXlJ4e3ZtkkpRguYI1/tzcPpv68Ym1S', '2024-11-30 13:56:50.700787+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-11-30 13:56:50.705201+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "12b5599e-364f-4e9d-8727-08b8f7aaf3c7", "email": "individual@dmmmsu.edu.ph", "last_name": "user", "first_name": "individual", "email_verified": false, "phone_verified": false}', NULL, '2024-11-30 13:56:50.692301+00', '2024-11-30 13:56:50.706494+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);

INSERT INTO auth.identities VALUES ('22eb2885-4e6b-4558-bfc0-9feae34e8844', '22eb2885-4e6b-4558-bfc0-9feae34e8844', '{"sub": "22eb2885-4e6b-4558-bfc0-9feae34e8844", "email": "admin@dmmmsu.edu.ph", "last_name": "user", "first_name": "admin", "email_verified": false, "phone_verified": false}', 'email', '2024-11-30 11:34:22.216223+00', '2024-11-30 11:34:22.216253+00', '2024-11-30 11:34:22.216253+00', DEFAULT, '74e316dc-9045-48df-a3ac-6b0f43e960c6');
INSERT INTO auth.identities VALUES ('12b5599e-364f-4e9d-8727-08b8f7aaf3c7', '12b5599e-364f-4e9d-8727-08b8f7aaf3c7', '{"sub": "12b5599e-364f-4e9d-8727-08b8f7aaf3c7", "email": "individual@dmmmsu.edu.ph", "last_name": "user", "first_name": "individual", "email_verified": false, "phone_verified": false}', 'email', '2024-11-30 13:56:50.698296+00', '2024-11-30 13:56:50.698322+00', '2024-11-30 13:56:50.698322+00', DEFAULT, '3e60c891-6293-4a73-835e-d51e2e7497a9');