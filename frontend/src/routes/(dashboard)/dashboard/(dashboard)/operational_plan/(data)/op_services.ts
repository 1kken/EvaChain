import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOperationalPlanSchema,
	updateOperationalPlanSchema,
	type CreateOperationalPlanSchema,
	type UpdateOperationalPlanSchema
} from './operational_plan_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import { checkIfOperationalPlanExists, fetchProfileDetails } from './services_helper';
import type { Database } from '$lib/types/database.types';

export async function createOperationalPlan(
	request: Request,
	session: Session,
	supabase: SupabaseClient<Database>
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

	//check if already exist
	const result = await checkIfOperationalPlanExists(supabase);
	if (result.error) {
		return message(form, result.message);
	}

	//get current user id
	const creator_id = session.user.id;
	//fetch profile details and get the unit,office,program
	const { data: profileData, error: profileError } = await fetchProfileDetails(
		creator_id,
		supabase
	);
	if (profileError || !profileData) {
		return message(form, { status: 'error', text: `Error fetching profile details` });
	}

	//get the unit,office,program
	const { unit_id, office_id, program_id } = profileData;
	if (!unit_id || !office_id || !program_id) {
		return message(form, { status: 'error', text: `Error fetching profile details` });
	}
	//get the form data
	const { title, implementing_unit } = form.data;

	const { data: opData, error } = await supabase
		.from('operational_plan')
		.insert({ title, implementing_unit, creator_id, unit_id, office_id, program_id })
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: `Error creating Operational plan` });
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
		return message(form, { status: 'error', text: `Error creating Operational plan` });
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
	const { id, title, implementing_unit } = form.data;

	const { data: opData, error } = await supabase
		.from('operational_plan')
		.update({ title, implementing_unit })
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: `Error creating Operational plan` });
	}

	return { form, opData };
}
