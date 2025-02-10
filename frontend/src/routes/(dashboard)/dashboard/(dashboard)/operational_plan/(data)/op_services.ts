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
import {
	checkAndCopyOperationalPlan,
	checkIfOperationalPlanExists,
	fetchProfileDetails
} from './services_helper';
import type { Database } from '$lib/types/database.types';

// export async function createOperationalPlan(
// 	request: Request,
// 	session: Session,
// 	supabase: SupabaseClient<Database>
// ) {
// 	const form = await superValidate<Infer<CreateOperationalPlanSchema>, App.Superforms.Message>(
// 		request,
// 		zod(createOperationalPlanSchema)
// 	);

// 	if (!form.valid) {
// 		return message(form, {
// 			status: 'error',
// 			text: 'Unprocessable input!'
// 		});
// 	}

// 	//get current user id
// 	const creator_id = session.user.id;
// 	//fetch profile details and get the unit,office,program
// 	const { data: profileData, error: profileError } = await fetchProfileDetails(
// 		creator_id,
// 		supabase
// 	);
// 	if (profileError || !profileData) {
// 		return message(form, { status: 'error', text: `Error fetching profile details` });
// 	}

// 	//check if already exist
// 	const result = await checkIfOperationalPlanExists(supabase, profileData);
// 	if (result.error) {
// 		return message(form, result.message);
// 	}

// 	//get the unit,office,program
// 	const { unit_id, office_id, program_id } = profileData;
// 	if (!unit_id) {
// 		return message(form, { status: 'error', text: `Error fetching profile details` });
// 	}
// 	//get the form data

// 	const { data: opData, error } = await supabase
// 		.from('operational_plan')
// 		.insert({
// 			creator_id,
// 			unit_id,
// 			office_id,
// 			program_id,
// 			...form.data
// 		})
// 		.select()
// 		.single();

// 	if (error) {
// 		return message(form, { status: 'error', text: `Error creating Operational plan` });
// 	}

// 	return { form, opData };
// }

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
