import { message, superValidate, type Infer } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentHeaderSchema,
	updateAccomplishmentHeaderSchema,
	type CreateAccomplishmentHeaderSchema,
	type UpdateAccomplishmentHeaderSchema
} from '../schema/header_schema';

export async function createAccomplishmentHeader(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<CreateAccomplishmentHeaderSchema>, App.Superforms.Message>(
		request,
		zod(createAccomplishmentHeaderSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { position, accomplishment_report_id, title } = form.data;
	const { data: accHeader, error: accHeaderError } = await supabase
		.from('accomplishment_header')
		.insert({ position, accomplishment_report_id, title: titleCase(title) })
		.select()
		.single();

	if (accHeaderError) {
		return message(form, {
			status: 'error',
			text: `Error saving header, ${accHeaderError.message}`
		});
	}

	return { form, accHeader };
}

export async function deleteAccomplishmentHeader(
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
	let { id } = form.data;

	const { data: accHeader, error: accHeaderError } = await supabase
		.from('accomplishment_header')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (accHeaderError) {
		return message(form, {
			status: 'error',
			text: `Error deleting header, ${accHeaderError.message}`
		});
	}

	return { form, accHeader };
}

export async function updateAccomplishmentHeader(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<UpdateAccomplishmentHeaderSchema>, App.Superforms.Message>(
		request,
		zod(updateAccomplishmentHeaderSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { id, title } = form.data;

	const { data: accHeader, error: accHeaderError } = await supabase
		.from('accomplishment_header')
		.update({ title })
		.eq('id', id)
		.select()
		.single();

	if (accHeaderError) {
		return message(form, {
			status: 'error',
			text: `Error updating header, ${accHeaderError.message}`
		});
	}

	return { form, accHeader };
}
