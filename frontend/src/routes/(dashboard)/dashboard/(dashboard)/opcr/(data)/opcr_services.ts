import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';
import { fetchProfile } from '$lib/utils/profileHelper';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import {
	createOpcrSchema,
	updateOpcrSchema,
	type CreateOpcrSchema,
	type UpdateOpcrSchema
} from './opcr_schema';
export async function createOPCR(
	request: Request,
	supabase: SupabaseClient<Database>,
	ownerId: string
) {
	const form = await superValidate<Infer<CreateOpcrSchema>, App.Superforms.Message>(
		request,
		zod(createOpcrSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { profile, profileError } = await fetchProfile(ownerId, supabase);
	if (profileError || !profile) {
		error(500, { message: 'Failed to fetch profile' });
	}

	const { unit_id, program_id, office_id } = profile;
	const { data: opcr, error: insertError } = await supabase
		.from('opcr')
		.insert({ ...form.data, unit_id, program_id, office_id, owner_id: ownerId })
		.select()
		.single();

	if (insertError) {
		error(500, { message: 'Failed to create OPCR' });
	}

	return { form, opcr };
}

export async function updateOPCR(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpcrSchema>, App.Superforms.Message>(
		request,
		zod(updateOpcrSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opcr, error } = await supabase
		.from('opcr')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (error) {
		return message(form, { status: 'error', text: 'Error updating OPCR' });
	}

	return { form, opcr };
}

export async function deleteOPCR(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opcr, error } = await supabase.from('opcr').delete().eq('id', id).select().single();

	if (error) {
		return message(form, { status: 'error', text: 'Error deleting OPCR' });
	}

	return { form, opcr };
}
