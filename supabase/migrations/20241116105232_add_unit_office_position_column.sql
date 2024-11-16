-- this adds extra column too public.profiles

-- add position
ALTER TABLE public.profiles
ADD COLUMN position positions;

--add unit 
ALTER TABLE public.profiles
ADD COLUMN unit_id uuid,
ADD CONSTRAINT fk_unit 
    FOREIGN KEY (unit_id) 
    REFERENCES units(id);

--add offices
ALTER TABLE public.profiles
ADD COLUMN office_id uuid,
ADD CONSTRAINT fk_office
    FOREIGN KEY (office_id) 
    REFERENCES offices(id);
