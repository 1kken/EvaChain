import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createStrategyPlanSchema, updateStrategyPlanSchema } from '../schema/strategy_plan_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { error } from '@sveltejs/kit';
import {
	createStrategyPlanPerformanceIndicatorSchema,
	updateStrategyPlanPerformanceIndicatorSchema
} from '../schema/performance_indicator_schema';

//fetch strategy plan
export async function fetchStrategyPlan(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strategy_plan')
		.select('*')
		.eq('strat_plan_id', id);

	if (fetchError) {
		error(500, { message: fetchError.message });
	}

	return data;
}

export async function fetchStrategicPlan(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strategic_plan')
		.select()
		.eq('id', id)
		.single();

	if (fetchError) {
		error(500, { message: fetchError.message });
	}

	return data;
}

//forms
export async function fetchStrategyPlanForms() {
	return {
		createForm: await superValidate(zod(createStrategyPlanSchema)),
		updateForm: await superValidate(zod(updateStrategyPlanSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
export async function fetchStrategyPerformanceIndicatorForms() {
	return {
		createForm: await superValidate(zod(createStrategyPlanPerformanceIndicatorSchema)),
		updateForm: await superValidate(zod(updateStrategyPlanPerformanceIndicatorSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
