CREATE TABLE position (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   nature_of_work_id INTEGER NOT NULL REFERENCES nature_of_work(id),
   name VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_position_nature_of_work_id ON position(nature_of_work_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON position
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
