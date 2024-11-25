-- First, drop existing foreign key constraints
ALTER TABLE office DROP CONSTRAINT office_unit_id_fkey;

ALTER TABLE program DROP CONSTRAINT program_unit_id_fkey;
ALTER TABLE program DROP CONSTRAINT program_office_id_fkey;

ALTER TABLE position DROP CONSTRAINT position_nature_of_work_id_fkey;

-- Then add them back with ON DELETE CASCADE
ALTER TABLE office 
    ADD CONSTRAINT office_unit_id_fkey 
    FOREIGN KEY (unit_id) 
    REFERENCES unit(id) 
    ON DELETE CASCADE;

ALTER TABLE program 
    ADD CONSTRAINT program_unit_id_fkey 
    FOREIGN KEY (unit_id) 
    REFERENCES unit(id) 
    ON DELETE CASCADE;

ALTER TABLE program 
    ADD CONSTRAINT program_office_id_fkey 
    FOREIGN KEY (office_id) 
    REFERENCES office(id) 
    ON DELETE CASCADE;

ALTER TABLE position 
    ADD CONSTRAINT position_nature_of_work_id_fkey 
    FOREIGN KEY (nature_of_work_id) 
    REFERENCES nature_of_work(id) 
    ON DELETE CASCADE;