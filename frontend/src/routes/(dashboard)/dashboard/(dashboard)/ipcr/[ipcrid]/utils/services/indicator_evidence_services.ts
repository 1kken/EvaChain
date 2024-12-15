import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';

//upload evidence
export async function uploadEvidence(
	indicator_id: string,
	user_id: string,
	file: File,
	supabase: SupabaseClient<Database>
) {
	const path = `${user_id}/${indicator_id}.pdf`;

	const { data, error } = await supabase.storage
		.from('indicator_evidence')
		.upload(path, file, { contentType: 'application/pdf' });

	return { data, error };
}

//save to evidence indicator evidence
export async function saveIndicatorEvidence(
	indicator_id: string,
	file_path: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error } = await supabase
		.from('indicator_evidence')
		.insert({ indicator_id, file_path })
		.single();
	return { data, error };
}
