import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createIpcrFunctionSchema,
	updateIpcrFunctionSchema,
	type CreateIpcrFunctionSchema,
	type UpdateIpcrFunctionSchema
} from '../schema/ipcr_function_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createIpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateIpcrFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createIpcrFunctionSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { position, ipcr_id, title } = form.data;
	const { data: ipcrFunction, error: ipcrError } = await supabase
		.from('ipcr_function')
		.insert({ position, ipcr_id, title: titleCase(title) })
		.select()
		.single();
	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving function , ${ipcrError.message}`
		});
	}

	return { form, ipcrFunction };
}

export async function updateteIpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateIpcrFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateIpcrFunctionSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { id, title } = form.data;
	const { data: ipcrFunction, error: ipcrError } = await supabase
		.from('ipcr_function')
		.update({ title: titleCase(title) })
		.eq('id', id)
		.select()
		.single();
	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving function , ${ipcrError.message}`
		});
	}

	return { form, ipcrFunction };
}

export async function deleteIpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
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
	const { data: ipcrFunction, error: ipcrError } = await supabase
		.from('ipcr_function')
		.delete()
		.eq('id', id)
		.select()
		.single();
	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving function , ${ipcrError.message}`
		});
	}

	return { form, ipcrFunction };
}
