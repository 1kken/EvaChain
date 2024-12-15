-- Create a new storage bucket for evidence files
insert into storage.buckets (id, name, public) values ('indicator_evidence', 'indicator_evidence', false);

-- CREATE POLICY "User can read their own evidence files"
-- ON storage.objects FOR SELECT USING (
--     bucket_id = 'indicator_evidence'
--     AND auth.uid()::text = (storage.foldername(name))[1]
-- );

CREATE POLICY "User can upload their own evidence files"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'indicator_evidence'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- CREATE POLICY "User can delete their own evidence files"
-- ON storage.objects FOR DELETE USING (
--     bucket_id = 'indicator_evidence'
--     AND auth.uid()::text = (storage.foldername(name))[1]
-- );

