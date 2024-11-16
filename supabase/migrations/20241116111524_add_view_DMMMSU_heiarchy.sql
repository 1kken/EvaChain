create or replace view "public"."DMMMSU_hierarchy" as  SELECT u.code AS unit_code,
    u.name AS unit_name,
    o.code AS office_code,
    o.name AS office_name
   FROM (units u
     LEFT JOIN offices o ON ((o.unit_id = u.id)))
  ORDER BY u.code, o.code;






