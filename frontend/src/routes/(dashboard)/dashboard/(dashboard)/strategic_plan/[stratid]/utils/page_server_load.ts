import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createStrategyPlanSchema, updateStrategyPlanSchema } from '../schema/strategy_plan_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/types/database.types';
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

interface StrategicWithObjectives {
	strategic: Tables<'strategic_plan'>;
	objectives: Tables<'strat_plan_objective'>[];
}

export async function fetchStrategicPlan(
	id: string,
	supabase: SupabaseClient<Database>
): Promise<StrategicWithObjectives> {
	const { data, error: fetchError } = await supabase
		.from('strategic_plan')
		.select(
			`
      *,
      strat_plan_objective!strategic_plan_id(*)
    `
		)
		.eq('id', id)
		.single();

	if (fetchError) {
		throw error(500, { message: fetchError.message });
	}

	if (!data) {
		throw error(404, { message: 'Strategic plan not found' });
	}

	// Extract and restructure the data
	const { strat_plan_objective, ...strategic } = data;

	return {
		strategic,
		objectives: strat_plan_objective || []
	};
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
