import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { createDpcrSchema, updateDpcrSchema } from './dpcr_schema';
import { superValidate } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

export async function getDPCRByOwnerId(ownerId: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.from('dpcr').select().eq('owner_id', ownerId);
	if (error) throw error;
	return data;
}

export async function getDPCRForms() {
	return {
		createForm: await superValidate(zod(createDpcrSchema)),
		updateForm: await superValidate(zod(updateDpcrSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
