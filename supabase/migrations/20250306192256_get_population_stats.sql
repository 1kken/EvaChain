CREATE OR REPLACE FUNCTION get_population_stats(
  filter_unit_id INTEGER DEFAULT NULL, 
  filter_office_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
  total_population BIGINT,
  male_population BIGINT,
  female_population BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_population,
    COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_population,
    COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_population
  FROM profiles
  WHERE (filter_unit_id IS NULL OR unit_id = filter_unit_id)
    AND (filter_office_id IS NULL OR office_id = filter_office_id);
END;
$$ LANGUAGE plpgsql;
