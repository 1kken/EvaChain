INSERT INTO user_roles (user_id, role_id)
SELECT 'c29f33e3-ccf6-4862-8ab2-9608c2a4cdf8'::uuid, r.id
FROM roles r
WHERE r.name = 'head_of_unit'
ON CONFLICT (user_id) DO UPDATE 
SET role_id = (SELECT id FROM roles WHERE name = 'head_of_unit'),
    updated_at = timezone('utc'::text, now());