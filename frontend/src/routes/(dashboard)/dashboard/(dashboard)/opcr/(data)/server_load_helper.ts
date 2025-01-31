import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { createOpcrSchema, updateOpcrSchema } from './opcr_schema';

export async function getOPCRByOwnerId(ownerId: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.from('opcr').select().eq('owner_id', ownerId);
	if (error) throw error;
	return data;
}

export async function getOPCRForms() {
	return {
		createForm: await superValidate(zod(createOpcrSchema)),
		updateForm: await superValidate(zod(updateOpcrSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
