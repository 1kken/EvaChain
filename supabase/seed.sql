-- Insert units
INSERT INTO units (code, name, description) VALUES
    ('OUS', 'Open University System', 'Open University Implimentation by DMMMMSU'),
    ('SLUC', 'South La Union Campus', 'South La Union Campus of the university'),
    ('MLUC', 'Mid La Union Campus', 'Mid La Union Campus of the university'),
    ('NLUC', 'North La Union Campus', 'North La Union Campus of the university'),
    ('NARTDI', 'NARTDI', 'National Agricultural Research and Technology Development Institute');



-- Insert offices with proper unit relationships
INSERT INTO offices (unit_id, code, name, description)
SELECT 
    u.id as unit_id,
    o.code as code,
    o.name as name,
    o.description as description
FROM (
    VALUES
    -- NLUC Offices
    ('CA_NLUC', 'College of Agriculture', 'College of Agriculture at North La Union Campus'),
    ('CAFF_NLUC', 'College of Agroforestry and Forestry', 'College of Agroforestry and Forestry at North La Union Campus'),
    ('CAS_NLUC', 'College of Arts and Sciences', 'College of Arts and Sciences at North La Union Campus'),
    ('CE_NLUC', 'College of Education', 'College of Education at North La Union Campus'),
    ('CGS_NLUC', 'College of Graduate Studies', 'College of Graduate Studies at North La Union Campus'),
    ('CIS_NLUC', 'College of Information Systems', 'College of Information Systems at North La Union Campus'),
    ('CVM_NLUC', 'College of Veterinary Medicine', 'College of Veterinary Medicine at North La Union Campus'),
    ('IABE_NLUC', 'Institute of Agricultural and Biosystems Engineering', 'Institute of Agricultural and Biosystems Engineering at North La Union Campus'),
    ('IABM_NLUC', 'Institute of Agribusiness Management', 'Institute of Agribusiness Management at North La Union Campus'),
    ('IES_NLUC', 'Institute of Environmental Studies', 'Institute of Environmental Studies at North La Union Campus'),
    
    -- MLUC Offices
    ('CGS_MLUC', 'College of Graduate Studies', 'College of Graduate Studies at Mid La Union Campus'),
    ('CLAW_MLUC', 'College of Law', 'College of Law at Mid La Union Campus'),
    ('COE_MLUC', 'College of Engineering', 'College of Engineering at Mid La Union Campus'),
    ('CIT_MLUC', 'College of Information Technology', 'College of Information Technology at Mid La Union Campus'),
    ('CAS_MLUC', 'College of Arts and Sciences', 'College of Arts and Sciences at Mid La Union Campus'),
    ('CE_MLUC', 'College of Education', 'College of Education at Mid La Union Campus'),
    ('COM_MLUC', 'College of Management', 'College of Management at Mid La Union Campus'),
    ('COT_MLUC', 'College of Technology', 'College of Technology at Mid La Union Campus'),
    ('ICJE_MLUC', 'Institute of Criminal Justice Education', 'Institute of Criminal Justice Education at Mid La Union Campus'),
    
    -- SLUC Offices
    ('CGS_SLUC', 'College of Graduate Studies', 'College of Graduate Studies at South La Union Campus'),
    ('CAS_SLUC', 'College of Arts and Sciences', 'College of Arts and Sciences at South La Union Campus'),
    ('CE_SLUC', 'College of Education', 'College of Education at South La Union Campus'),
    ('CCS_SLUC', 'College of Computer Studies', 'College of Computer Studies at South La Union Campus'),
    ('CA_SLUC', 'College of Agriculture', 'College of Agriculture at South La Union Campus'),
    ('CF_SLUC', 'College of Fisheries', 'College of Fisheries at South La Union Campus'),
    ('CCHAMS_SLUC', 'College of Health and Medical Sciences', 'College of Health and Medical Sciences at South La Union Campus'),
    ('COLME_SLUC', 'College of Medicine', 'College of Medicine at South La Union Campus')
) as o(code, name, description)
JOIN units u ON u.code = get_unit_from_office_code(o.code);
