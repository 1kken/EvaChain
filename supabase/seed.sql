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

--create chairman role
INSERT INTO roles (name) 
VALUES ('chairman')
ON CONFLICT (name) DO NOTHING;

--create dean role
INSERT INTO roles (name) 
VALUES ('dean')
ON CONFLICT (name) DO NOTHING;

--create permission review_ipcr
INSERT INTO permissions(name,description)
VALUES('review_ipcr','This permission can be attached to any roles that has the capabilties to review an ipcr');

--attach permissions to roles
-- For chairman role with program scope
INSERT INTO public.role_permissions (role_id, permission_id, scope)
SELECT r.id, p.id, 'program'::scope_type
FROM roles r, permissions p
WHERE r.name = 'chairman' 
AND p.name = 'review_ipcr'
ON CONFLICT (role_id, permission_id) DO UPDATE 
SET updated_at = timezone('utc'::text, now());

-- For dean role with office scope
INSERT INTO public.role_permissions (role_id, permission_id, scope)
SELECT r.id, p.id, 'office'::scope_type
FROM roles r, permissions p
WHERE r.name = 'dean' 
AND p.name = 'review_ipcr'
ON CONFLICT (role_id, permission_id) DO UPDATE 
SET updated_at = timezone('utc'::text, now());

-- User seed
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '9f972be5-bacf-4e95-896b-4a68bf588420', 'authenticated', 'authenticated', 'officesupervisor@dmmmsu.edu.ph', '$2a$10$OpUy0IzvDxZwI6xKqiuYDOtGhVj6/GYnqwt9JC/9Ztv3/f4WmyxHe', '2024-12-01 10:07:13.532809+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-01 10:07:13.535995+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "9f972be5-bacf-4e95-896b-4a68bf588420", "email": "officesupervisor@dmmmsu.edu.ph", "last_name": "supervisor", "first_name": "office", "email_verified": false, "phone_verified": false}', NULL, '2024-12-01 10:07:13.529213+00', '2024-12-01 10:07:13.537108+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '3d9b104f-f948-40d5-9626-072e890903f7', 'authenticated', 'authenticated', 'individualccs@dmmmsu.edu.ph', '$2a$10$Iyd2rX4FxAHRmIqOcp997uVitQnQ2mMVoQXljN6ovxSway.6i2/HS', '2024-12-01 10:01:46.072996+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-01 10:01:46.075626+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "3d9b104f-f948-40d5-9626-072e890903f7", "email": "individualccs@dmmmsu.edu.ph", "last_name": "user", "first_name": "individual", "email_verified": false, "phone_verified": false}', NULL, '2024-12-01 10:01:46.065088+00', '2024-12-01 10:01:46.077517+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '36e153b6-4f13-4da3-ae7e-d43f84bce24d', 'authenticated', 'authenticated', 'officeguy@dmmmsu.edu.ph', '$2a$10$7jCqoq1FDXrIIccGM5DOeeoz9etK0Rf4qGaB/AHEiXhT74ouyRn4y', '2024-12-01 10:06:00.53368+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-01 10:08:00.448204+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "36e153b6-4f13-4da3-ae7e-d43f84bce24d", "email": "officeguy@dmmmsu.edu.ph", "last_name": "guy", "first_name": "office", "email_verified": false, "phone_verified": false}', NULL, '2024-12-01 10:06:00.529358+00', '2024-12-01 10:08:00.449353+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'c92ae2f1-88c3-40b5-b336-84e69b4e18a6', 'authenticated', 'authenticated', 'deanccs@dmmmsu.edu.ph', '$2a$10$B9HywoVhIGdMsRV3vzKrrORA5Hy0ErLFwyNNH7awpRnWgrx8S.ws2', '2024-12-01 10:04:00.168034+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-01 10:04:00.171383+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "c92ae2f1-88c3-40b5-b336-84e69b4e18a6", "email": "deanccs@dmmmsu.edu.ph", "last_name": "ccs", "first_name": "dean", "email_verified": false, "phone_verified": false}', NULL, '2024-12-01 10:04:00.16379+00', '2024-12-01 10:04:00.17255+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'ba074232-a4d6-4019-8036-613addb99c06', 'authenticated', 'authenticated', 'admin@dmmmsu.edu.ph', '$2a$10$wgeEbG5l63DpSjjvdo1KC.FLYCPv26GR3JLsIdu1wCC0RokwrR2c2', '2024-12-01 10:02:39.231327+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-01 10:02:39.233455+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ba074232-a4d6-4019-8036-613addb99c06", "email": "admin@dmmmsu.edu.ph", "last_name": "user", "first_name": "admin", "email_verified": false, "phone_verified": false}', NULL, '2024-12-01 10:02:39.227395+00', '2024-12-01 10:02:39.234579+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '9a4ba6de-9fc0-4110-8445-f9a1efbc1432', 'authenticated', 'authenticated', 'chairmanccs@dmmmsu.edu.ph', '$2a$10$z2rwy1PG2FOex0I.N2beruGsRpv3hUUBIQgBzsoDzZ0Ai8e0H23ea', '2024-12-01 10:03:07.225607+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-01 10:03:07.22984+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "9a4ba6de-9fc0-4110-8445-f9a1efbc1432", "email": "chairmanccs@dmmmsu.edu.ph", "last_name": "ccs", "first_name": "chairman", "email_verified": false, "phone_verified": false}', NULL, '2024-12-01 10:03:07.221713+00', '2024-12-01 10:03:07.231355+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);

INSERT INTO auth.identities VALUES ('3d9b104f-f948-40d5-9626-072e890903f7', '3d9b104f-f948-40d5-9626-072e890903f7', '{"sub": "3d9b104f-f948-40d5-9626-072e890903f7", "email": "individualccs@dmmmsu.edu.ph", "last_name": "user", "first_name": "individual", "email_verified": false, "phone_verified": false}', 'email', '2024-12-01 10:01:46.070554+00', '2024-12-01 10:01:46.070579+00', '2024-12-01 10:01:46.070579+00', DEFAULT, '165d7154-4a8a-4c32-994e-c694f556c7ce');
INSERT INTO auth.identities VALUES ('ba074232-a4d6-4019-8036-613addb99c06', 'ba074232-a4d6-4019-8036-613addb99c06', '{"sub": "ba074232-a4d6-4019-8036-613addb99c06", "email": "admin@dmmmsu.edu.ph", "last_name": "user", "first_name": "admin", "email_verified": false, "phone_verified": false}', 'email', '2024-12-01 10:02:39.22963+00', '2024-12-01 10:02:39.229652+00', '2024-12-01 10:02:39.229652+00', DEFAULT, '82982932-28c4-4e16-b300-767aee6fb97e');
INSERT INTO auth.identities VALUES ('9a4ba6de-9fc0-4110-8445-f9a1efbc1432', '9a4ba6de-9fc0-4110-8445-f9a1efbc1432', '{"sub": "9a4ba6de-9fc0-4110-8445-f9a1efbc1432", "email": "chairmanccs@dmmmsu.edu.ph", "last_name": "ccs", "first_name": "chairman", "email_verified": false, "phone_verified": false}', 'email', '2024-12-01 10:03:07.223924+00', '2024-12-01 10:03:07.223946+00', '2024-12-01 10:03:07.223946+00', DEFAULT, '22edf1a5-f2ea-4f14-b6ff-42adfa48b657');
INSERT INTO auth.identities VALUES ('c92ae2f1-88c3-40b5-b336-84e69b4e18a6', 'c92ae2f1-88c3-40b5-b336-84e69b4e18a6', '{"sub": "c92ae2f1-88c3-40b5-b336-84e69b4e18a6", "email": "deanccs@dmmmsu.edu.ph", "last_name": "ccs", "first_name": "dean", "email_verified": false, "phone_verified": false}', 'email', '2024-12-01 10:04:00.166114+00', '2024-12-01 10:04:00.166137+00', '2024-12-01 10:04:00.166137+00', DEFAULT, '386a03f3-eb45-4b60-a21b-c137ea050ac5');
INSERT INTO auth.identities VALUES ('36e153b6-4f13-4da3-ae7e-d43f84bce24d', '36e153b6-4f13-4da3-ae7e-d43f84bce24d', '{"sub": "36e153b6-4f13-4da3-ae7e-d43f84bce24d", "email": "officeguy@dmmmsu.edu.ph", "last_name": "guy", "first_name": "office", "email_verified": false, "phone_verified": false}', 'email', '2024-12-01 10:06:00.53176+00', '2024-12-01 10:06:00.531785+00', '2024-12-01 10:06:00.531785+00', DEFAULT, 'a02df683-a039-4751-884f-dd1f673d36f4');
INSERT INTO auth.identities VALUES ('9f972be5-bacf-4e95-896b-4a68bf588420', '9f972be5-bacf-4e95-896b-4a68bf588420', '{"sub": "9f972be5-bacf-4e95-896b-4a68bf588420", "email": "officesupervisor@dmmmsu.edu.ph", "last_name": "supervisor", "first_name": "office", "email_verified": false, "phone_verified": false}', 'email', '2024-12-01 10:07:13.531258+00', '2024-12-01 10:07:13.531282+00', '2024-12-01 10:07:13.531282+00', DEFAULT, '1e7ec29c-33cd-4822-aee9-dff9e5e7b01b');

-- seeding profile
UPDATE public.profiles 
SET updated_at = '2024-12-01 10:02:02.592262+00',
    employee_id = '123123',
    email = 'individualccs@dmmmsu.edu.ph',
    first_name = 'individual',
    middle_name = NULL,
    last_name = 'user',
    avatar_url = NULL,
    unit_id = 2,
    nature_of_work_id = 1,
    office_id = 9,
    program_id = 1,
    position_id = 1,
    employee_status_id = 1,
    created_at = '2024-12-01 10:01:46.064734+00'
WHERE id = '3d9b104f-f948-40d5-9626-072e890903f7';

UPDATE public.profiles 
SET updated_at = '2024-12-01 10:02:39.227072+00',
    employee_id = NULL,
    email = 'admin@dmmmsu.edu.ph',
    first_name = 'admin',
    middle_name = NULL,
    last_name = 'user',
    avatar_url = NULL,
    unit_id = NULL,
    nature_of_work_id = NULL,
    office_id = NULL,
    program_id = NULL,
    position_id = NULL,
    employee_status_id = NULL,
    created_at = '2024-12-01 10:02:39.227072+00'
WHERE id = 'ba074232-a4d6-4019-8036-613addb99c06';

UPDATE public.profiles 
SET updated_at = '2024-12-01 10:03:33.713607+00',
    employee_id = '123123123',
    email = 'chairmanccs@dmmmsu.edu.ph',
    first_name = 'chairman',
    middle_name = NULL,
    last_name = 'ccs',
    avatar_url = NULL,
    unit_id = 2,
    nature_of_work_id = 1,
    office_id = 9,
    program_id = 1,
    position_id = 4,
    employee_status_id = 1,
    created_at = '2024-12-01 10:03:07.221383+00'
WHERE id = '9a4ba6de-9fc0-4110-8445-f9a1efbc1432';

UPDATE public.profiles 
SET updated_at = '2024-12-01 10:04:15.341618+00',
    employee_id = '123123123123123',
    email = 'deanccs@dmmmsu.edu.ph',
    first_name = 'dean',
    middle_name = NULL,
    last_name = 'ccs',
    avatar_url = NULL,
    unit_id = 2,
    nature_of_work_id = 1,
    office_id = 9,
    program_id = 1,
    position_id = 4,
    employee_status_id = 1,
    created_at = '2024-12-01 10:04:00.163466+00'
WHERE id = 'c92ae2f1-88c3-40b5-b336-84e69b4e18a6';

UPDATE public.profiles 
SET updated_at = '2024-12-01 10:06:30.10174+00',
    employee_id = '46758897',
    email = 'officeguy@dmmmsu.edu.ph',
    first_name = 'office',
    middle_name = NULL,
    last_name = 'guy',
    avatar_url = NULL,
    unit_id = 3,
    nature_of_work_id = 2,
    office_id = 5,
    program_id = NULL,
    position_id = 7,
    employee_status_id = 1,
    created_at = '2024-12-01 10:06:00.528557+00'
WHERE id = '36e153b6-4f13-4da3-ae7e-d43f84bce24d';

UPDATE public.profiles 
SET updated_at = '2024-12-01 10:07:47.313769+00',
    employee_id = '12312312312312312',
    email = 'officesupervisor@dmmmsu.edu.ph',
    first_name = 'office',
    middle_name = NULL,
    last_name = 'supervisor',
    avatar_url = NULL,
    unit_id = 3,
    nature_of_work_id = 2,
    office_id = 5,
    program_id = NULL,
    position_id = 5,
    employee_status_id = 1,
    created_at = '2024-12-01 10:07:13.528927+00'
WHERE id = '9f972be5-bacf-4e95-896b-4a68bf588420';

-- attach roles to users
INSERT INTO public.user_roles (user_id, role_id)
SELECT '9a4ba6de-9fc0-4110-8445-f9a1efbc1432', r.id
FROM roles r
WHERE r.name = 'chairman';

-- dean role
INSERT INTO public.user_roles (user_id, role_id)
SELECT 'c92ae2f1-88c3-40b5-b336-84e69b4e18a6', r.id
FROM roles r
WHERE r.name = 'dean';


