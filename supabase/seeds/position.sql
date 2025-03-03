--  Position Seeder (Using subquery to get nature_of_work_id)
INSERT INTO public.position (nature_of_work_id, name) VALUES
    -- Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Instructor-I'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Instructor-II'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Instructor-III'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor-I'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor-II'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor-III'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Assistant Professor-IV'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor-I'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor-II'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor-III'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor-IV'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Associate Professor-V'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor-I'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor-II'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor-III'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor-IV'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor-V'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Teaching'), 'Professor-VI'),

    -- Non-Teaching Positions
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Administrative Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Records Officer'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Library Assistant'),
    ((SELECT id FROM public.nature_of_work WHERE type = 'Non-Teaching'), 'Laboratory Technician')
ON CONFLICT (name) DO UPDATE 
    SET nature_of_work_id = EXCLUDED.nature_of_work_id,
        updated_at = timezone('utc'::text, now());