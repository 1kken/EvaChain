import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	publishStratPlanSchema,
	type PublishStratPlanSchema
} from '../schema/publish_stat_plan_schema';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generateOPCRFromStrategicPlan } from './utils/generateOPCRfromStratPlan';

export async function publishStratPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<PublishStratPlanSchema>, App.Superforms.Message>(
		request,
		zod(publishStratPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id } = form.data;

	const { data: strategicPlan, error: strategicError } = await supabase
		.from('strategic_plan')
		.update({ status: 'published' })
		.eq('id', id)
		.select()
		.single();

	if (strategicError) {
		return message(form, {
			status: 'error',
			text: `Error publishing Strategic Plan., ${strategicError.message}`
		});
	}

	//! Generate OPCR
	try {
		const res = await generateOPCRFromStrategicPlan(supabase, {
			strategicPlanId: id,
			userId: strategicPlan.owner_id
		});
		console.log(res);
	} catch (error) {
		console.log(error);
	}

	return { form };
}
