
--attach permissions to roles
-- For chairman role with program scope
-- INSERT INTO public.role_permissions (role_id, permission_id, scope)
-- SELECT r.id, p.id, 'program'::scope_type
-- FROM roles r, permissions p
-- WHERE r.name = 'chairman' 
-- AND p.name = 'review_ipcr'
-- ON CONFLICT (role_id, permission_id) DO UPDATE 
-- SET updated_at = timezone('utc'::text, now());

-- For dean role with office scope
-- INSERT INTO public.role_permissions (role_id, permission_id, scope)
-- SELECT r.id, p.id, 'office'::scope_type
-- FROM roles r, permissions p
-- WHERE r.name = 'dean' 
-- AND p.name = 'review_ipcr'
-- ON CONFLICT (role_id, permission_id) DO UPDATE 
-- SET updated_at = timezone('utc'::text, now());

-- For Head of Operation Unit
INSERT INTO public.role_permissions (role_id, permission_id, scope)
SELECT r.id, p.id, 'unit'::scope_type
FROM roles r, permissions p
WHERE r.name = 'head_of_unit' 
AND p.name = 'edit_operational_plan'
ON CONFLICT (role_id, permission_id) DO UPDATE 
SET updated_at = timezone('utc'::text, now());
