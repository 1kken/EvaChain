import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createAccomplishmentReportSchema,
	updateAccomplishmentReportSchema,
	type CreateAccomplishmentReportSchema,
	type UpdateAccomplishmentReportSchema
} from './accomp_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { checkIfAccomplishmentReportExists, fetchProfileDetails } from './services_helper';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createAccomplishmentReport(
	request: Request,
	session: Session,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<CreateAccomplishmentReportSchema>, App.Superforms.Message>(
		request,
		zod(createAccomplishmentReportSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	// Get current user id
	const owner_id = session.user.id;

	// Fetch profile details and get the unit, office, program
	const { data: profileData, error: profileError } = await fetchProfileDetails(owner_id, supabase);

	if (profileError || !profileData) {
		return message(form, { status: 'error', text: `Error fetching profile details` });
	}

	// Check if report already exists
	const result = await checkIfAccomplishmentReportExists(supabase, profileData);
	if (result.error) {
		return message(form, result.message);
	}

	// Get the unit, office, program
	const { unit_id, office_id, program_id } = profileData;
	if (!unit_id) {
		return message(form, { status: 'error', text: `Error fetching profile details` });
	}

	// Get the form data
	const { title, implementing_unit } = form.data;

	// Insert the accomplishment report
	const { data: accData, error } = await supabase
		.from('accomplishment_report')
		.insert({
			title,
			implementing_unit,
			owner_id,
			unit_id,
			office_id,
			program_id,
			status: 'draft' // Set initial status as draft
		})
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: `Error creating Accomplishment Report` });
	}

	return { form, accData };
}

export async function deleteAccomplishmentReport(
	request: Request,
	supabase: SupabaseClient<Database>
) {
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

	const { data: accData, error } = await supabase
		.from('accomplishment_report')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: `Error deleting Operational plan` });
	}

	return { form, accData };
}

export async function updateAccomplishmentReport(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<UpdateAccomplishmentReportSchema>, App.Superforms.Message>(
		request,
		zod(updateAccomplishmentReportSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, title, implementing_unit } = form.data;

	const { data: accData, error } = await supabase
		.from('accomplishment_report')
		.update({ title, implementing_unit })
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: `Error updating Accomplishment Report` });
	}

	return { form, accData };
}
