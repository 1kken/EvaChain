import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpHeaderSchema,
	updateOpHeaderSchema,
	type CreateOpHeaderSchema,
	type UpdateOpHeaderSchema
} from '../schema/op_header_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpHeader(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpHeaderSchema>, App.Superforms.Message>(
		request,
		zod(createOpHeaderSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { position, operational_plan_id, title } = form.data;
	const { data: opHeader, error: opHeaderError } = await supabase
		.from('op_header')
		.insert({ position, operational_plan_id, title: titleCase(title) })
		.select()
		.single();
	if (opHeaderError) {
		return message(form, {
			status: 'error',
			text: `Error saving header , ${opHeaderError.message}`
		});
	}

	return { form, opHeader };
}
export async function deleteOpHeader(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opHeader, error: opHeaderError } = await supabase
		.from('op_header')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (opHeaderError) {
		return message(form, {
			status: 'error',
			text: `Error updating header, ${opHeaderError.message}`
		});
	}

	return { form, opHeader };
}

export async function updateOpHeader(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpHeaderSchema>, App.Superforms.Message>(
		request,
		zod(updateOpHeaderSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { id, title } = form.data;

	const { data: opHeader, error: opHeaderError } = await supabase
		.from('op_header')
		.update({ title })
		.eq('id', id)
		.select()
		.single();

	if (opHeaderError) {
		return message(form, {
			status: 'error',
			text: `Error deleteing header ${opHeaderError.message}`
		});
	}

	return { form, opHeader };
}
