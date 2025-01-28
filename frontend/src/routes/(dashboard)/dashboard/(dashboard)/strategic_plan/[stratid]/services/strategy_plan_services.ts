import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	createStrategyPlanSchema,
	updateStrategyPlanSchema,
	type CreateStrategyPlanSchema,
	type UpdateStrategyPlanSchema
} from '../schema/strategy_plan_schema';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { UpdateStratPlanSchema } from '../../(data)/strat_plan_schema';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createStrategyPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateStrategyPlanSchema>, App.Superforms.Message>(
		request,
		zod(createStrategyPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { strat_plan_id, description, position } = form.data;
	console.log(strat_plan_id);
	const { data: strategyPlan, error: strategyPlanError } = await supabase
		.from('strategy_plan')
		.insert({ strat_plan_id, description, position })
		.select()
		.single();

	if (strategyPlanError) {
		return message(form, {
			status: 'error',
			text: `Error saving strategy plan, ${strategyPlanError.message}`
		});
	}

	return { form, strategyPlan };
}

export async function updateStrategyPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateStrategyPlanSchema>, App.Superforms.Message>(
		request,
		zod(updateStrategyPlanSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: strategyPlan, error: strategyPlanError } = await supabase
		.from('strategy_plan')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();
	if (strategyPlanError) {
		return message(form, {
			status: 'error',
			text: `Error saving strategy plan, ${strategyPlanError.message}`
		});
	}

	return { form, strategyPlan };
}

export async function deleteStrategyPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UniversalDeleteSchema>, App.Superforms.Message>(
		request,
		zod(universalDeleteSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id } = form.data;

	const { data: strategyPlan, error: strategyPlanError } = await supabase
		.from('strategy_plan')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (strategyPlanError) {
		return message(form, {
			status: 'error',
			text: `Error deleting strategy plan, ${strategyPlanError.message}`
		});
	}

	return { form, strategyPlan };
}
