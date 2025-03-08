-- Create a view to track teaching effectiveness scores by office, semester, and year
CREATE OR REPLACE VIEW office_teaching_effectiveness_history AS 
SELECT 
    o.id AS office_id,
    o.code AS office_code,
    o.name AS office_name,
    EXTRACT(YEAR FROM i.created_at) AS year,
    AVG(CASE 
        WHEN EXTRACT(MONTH FROM i.created_at) BETWEEN 1 AND 6 
        THEN COALESCE(tea.teaching_effectiveness_avg, 0) 
    END) AS period_1_avg,
    AVG(CASE 
        WHEN EXTRACT(MONTH FROM i.created_at) BETWEEN 7 AND 12 
        THEN COALESCE(tea.teaching_effectiveness_avg, 0) 
    END) AS period_2_avg
FROM 
    ipcr i
JOIN 
    ipcr_teaching_effectiveness_avg tea ON i.id = tea.id
JOIN 
    office o ON i.office_id = o.id
GROUP BY 
    o.id, o.code, o.name, EXTRACT(YEAR FROM i.created_at)
ORDER BY 
    o.name, year;