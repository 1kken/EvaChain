-- 4. Programme Seeder (Using subqueries to get unit_ids and office_ids)
INSERT INTO
    public.program (unit_id, office_id, name)
VALUES
    -- SLUC Programmes
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'SLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CCS'
        ),
        'Bachelor of Science in Computer Science'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'SLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CCHAMS'
        ),
        'Bachelor of Science in Nursing'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'SLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CCHAMS'
        ),
        'Bachelor of Science in Midwifery'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'SLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CM'
        ),
        'Doctor of Medicine'
    ),
    -- MLUC Programmes
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'MLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'COL'
        ),
        'Juris Doctor'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'MLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CIT'
        ),
        'Master in Information Technology'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'MLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CIT'
        ),
        'Bachelor of Science in Information Technology'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'MLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'COE'
        ),
        'Bachelor of Science in Electrical Engineering'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'MLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'COE'
        ),
        'Bachelor of Science in Mechanical Engineering'
    ),
    -- NLUC Programmes
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'NLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'IES'
        ),
        'Bachelor of Science in Environmental Science'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'NLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CVM'
        ),
        'Doctor of Veterinary Medicine'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'NLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CAS'
        ),
        'Bachelor of Science in Biology'
    ),
    (
        (
            SELECT
                id
            FROM
                public.unit
            WHERE
                code = 'NLUC'
        ),
        (
            SELECT
                id
            FROM
                public.office
            WHERE
                code = 'CAS'
        ),
        'Bachelor of Science in English Language'
    ) ON CONFLICT DO NOTHING;