-- Create a new storage bucket for evidence files
insert into storage.buckets (id, name, public) 
values ('indicator_evidence', 'indicator_evidence', false);

-- Set up access control policies for evidence files
CREATE POLICY "User can upload their own evidence files"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'indicator_evidence'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to read evidence files
CREATE POLICY "Can read evidence files"
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'indicator_evidence');

-- Allow anyone to update their own evidence files
CREATE POLICY "User can update their own evidence files"
ON storage.objects FOR UPDATE USING (
   bucket_id = 'indicator_evidence'
   AND auth.uid()::text = (storage.foldername(name))[1]
);