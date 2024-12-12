ALTER TABLE indicator
ADD COLUMN other_function_id UUID REFERENCES other_function(id) ON DELETE CASCADE,
ADD COLUMN sub_other_function_id UUID REFERENCES sub_other_function(id) ON DELETE CASCADE;