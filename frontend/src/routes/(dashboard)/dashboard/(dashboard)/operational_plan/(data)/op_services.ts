import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOperationalPlanSchema,
	submitOPschema,
	updateOperationalPlanSchema,
	type CreateOperationalPlanSchema,
	type SubmitOPSchema,
	type UpdateOperationalPlanSchema
} from './operational_plan_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import { checkAndCopyOperationalPlan, fetchProfileDetails } from './services_helper';
import type { Database } from '$lib/types/database.types';

export async function createOperationalPlan(
	request: Request,
	session: Session,
	supabase: SupabaseClient<Database>,
	shouldCopy = false
) {
	const form = await superValidate<Infer<CreateOperationalPlanSchema>, App.Superforms.Message>(
		request,
		zod(createOperationalPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const creator_id = session.user.id;
	const { data: profileData, error: profileError } = await fetchProfileDetails(
		creator_id,
		supabase
	);

	if (profileError || !profileData || !profileData.unit_id) {
		return message(form, { status: 'error', text: 'Error fetching profile details' });
	}

	const { unit_id, office_id, program_id } = profileData;

	if (shouldCopy) {
		const copyResult = await checkAndCopyOperationalPlan(supabase, profileData, {
			creator_id,
			unit_id,
			office_id,
			program_id,
			...form.data
		});

		if (!copyResult.success) {
			return message(form, { status: 'error', text: copyResult.error });
		}

		const { data: opData } = await supabase
			.from('operational_plan')
			.select()
			.eq('id', copyResult.id!)
			.single();

		return { form, opData };
	}

	const { data: opData, error } = await supabase
		.from('operational_plan')
		.insert({
			creator_id,
			unit_id,
			office_id,
			program_id,
			...form.data
		})
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: 'Error creating Operational plan' });
	}

	return { form, opData };
}
export async function deleteOperationalPlan(request: Request, supabase: SupabaseClient<Database>) {
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
	const { id } = form.data;

	const { data: opData, error } = await supabase
		.from('operational_plan')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (error) {
		if (error.code === '23502') {
			return message(form, {
				status: 'error',
				text: `Cannot delete, this Operational Plan has dependants.`
			});
		} else {
			return message(form, { status: 'error', text: `${error.message}` });
		}
	}

	return { form, opData };
}

export async function updateOperationalPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOperationalPlanSchema>, App.Superforms.Message>(
		request,
		zod(updateOperationalPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opData, error } = await supabase
		.from('operational_plan')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: `Error creating Operational plan` });
	}

	return { form, opData };
}

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
		const { data: updatedOP, error: updateError } = await supabase
			.from('operational_plan')
			.update({
				updated_at: new Date().toISOString()
				// status: 'submitted' // Uncomment if you have a status field
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

		return {
			form,
			data: updatedOP,
			message: message(form, {
				status: 'success',
				text: 'Operational Plan validated successfully'
			})
		};
	} catch (error) {
		console.error('Error in submitOperationalPlan:', error);
	}
}
