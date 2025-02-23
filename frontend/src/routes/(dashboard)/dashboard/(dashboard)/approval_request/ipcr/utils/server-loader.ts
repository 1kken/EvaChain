import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { revisionSchema, uuidSchema } from '../(data)/zod_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

//Server fetch data ipcr_immediate_supervisor
export async function fetchIpcrDetailsWithUserId(
	userId: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error } = await supabase
		.from('ipcr_supervisor_details_view')
		.select()
		.eq('supervisor_id', userId);
	if (error) {
		throw error;
	}
	return data;
}

export async function getActionForms() {
	return {
		revisionForm: await superValidate(zod(revisionSchema), {}),
		uuidForm: await superValidate(zod(uuidSchema), {})
	};
}
