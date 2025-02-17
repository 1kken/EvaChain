import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { submitOPschema, type SubmitOPSchema } from '../schema/op_submit_schema';
import { zod } from 'sveltekit-superforms/adapters';

export async function submitOperationalPlan(request: Request, supabase: SupabaseClient<Database>) {
	try {
		const form = await superValidate<Infer<SubmitOPSchema>, App.Superforms.Message>(
			request,
			zod(submitOPschema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Invalid form submission. Please check your input.'
			});
		}

		const { operationalPlanID } = form.data;

		// Validate Operational Plan completeness
		const { data: validationResult, error: validationError } = await supabase.rpc(
			'validate_operational_plan',
			{
				p_operational_plan_id: operationalPlanID
			}
		);

		if (validationError) {
			return message(form, {
				status: 'error',
				text: `Error validating Operational Plan: ${validationError.message}`
			});
		}

		if (!validationResult.is_valid) {
			return message(form, {
				status: 'error',
				text: `Operational Plan is incomplete: ${validationResult.validation_message}`
			});
		}

		// If you want to update status after validation (assuming you have a status field)
		const { data: opData, error: updateError } = await supabase
			.from('operational_plan')
			.update({
				status: 'submitted' // Uncomment if you have a status field
			})
			.eq('id', operationalPlanID)
			.select()
			.single();

		if (updateError) {
			return message(form, {
				status: 'error',
				text: `Error updating Operational Plan: ${updateError.message}`
			});
		}

		return { form, opData };
	} catch (error) {
		console.error('Error in submitOperationalPlan:', error);
	}
}
