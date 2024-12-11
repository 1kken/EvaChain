ALTER TABLE indicator
ADD COLUMN support_function_id UUID REFERENCES support_function(id) ON DELETE CASCADE,
ADD COLUMN sub_support_function_id UUID REFERENCES sub_support_function(id) ON DELETE CASCADE;