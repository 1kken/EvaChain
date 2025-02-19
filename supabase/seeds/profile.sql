-- seeding profile
UPDATE public.profiles
SET
    updated_at = '2024-12-01 10:02:02.592262+00',
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
WHERE
    id = '3d9b104f-f948-40d5-9626-072e890903f7';

UPDATE public.profiles
SET
    updated_at = '2024-12-01 10:02:39.227072+00',
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
WHERE
    id = 'ba074232-a4d6-4019-8036-613addb99c06';

UPDATE public.profiles
SET
    updated_at = '2024-12-01 10:03:33.713607+00',
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
WHERE
    id = '9a4ba6de-9fc0-4110-8445-f9a1efbc1432';

UPDATE public.profiles
SET
    updated_at = '2024-12-01 10:04:15.341618+00',
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
WHERE
    id = 'c92ae2f1-88c3-40b5-b336-84e69b4e18a6';

UPDATE public.profiles
SET
    updated_at = '2024-12-01 10:06:30.10174+00',
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
WHERE
    id = '36e153b6-4f13-4da3-ae7e-d43f84bce24d';

UPDATE public.profiles
SET
    updated_at = '2024-12-01 10:07:47.313769+00',
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
WHERE
    id = '9f972be5-bacf-4e95-896b-4a68bf588420';

UPDATE public.profiles
SET
    updated_at = '2025-02-19 10:10:00.000000+00',
    employee_id = '211-0879-3',
    email = 'headunit@dmmmsu.edu.ph',
    first_name = 'Head',
    middle_name = NULL,
    last_name = 'Unit',
    avatar_url = NULL,
    unit_id = 2,
    nature_of_work_id = 2,
    office_id = 7,
    program_id = NULL,
    position_id = 5,
    employee_status_id = 1,
    created_at = '2025-02-19 10:05:22.893033+00'
WHERE
    id = 'c29f33e3-ccf6-4862-8ab2-9608c2a4cdf8';

-- attach roles to users
INSERT INTO
    public.user_roles (user_id, role_id)
SELECT
    '9a4ba6de-9fc0-4110-8445-f9a1efbc1432',
    r.id
FROM
    roles r
WHERE
    r.name = 'chairman';

-- dean role
INSERT INTO
    public.user_roles (user_id, role_id)
SELECT
    'c92ae2f1-88c3-40b5-b336-84e69b4e18a6',
    r.id
FROM
    roles r
WHERE
    r.name = 'dean';