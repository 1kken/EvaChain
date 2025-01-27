import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { createStrategicPlanSchema, updateStrategicPlanSchema } from './strat_plan_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { deleteUnitSchema } from '$lib/schemas/unit/schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';

export async function getStrategicPlanByOwnerId(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strategic_plan')
		.select()
		.eq('owner_id', id);

	if (fetchError) {
		error(500, { message: 'Error Fetching strategic plan.' });
	}

	return data;
}

//forms
export async function getStrategicPlanForms() {
	return {
		createForm: await superValidate(zod(createStrategicPlanSchema)),
		updateForm: await superValidate(zod(updateStrategicPlanSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
