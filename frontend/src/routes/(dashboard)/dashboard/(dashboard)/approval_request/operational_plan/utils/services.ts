import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { uuidSchema, type UuidSchema } from '../(data)/zod_schema';
import { zod } from 'sveltekit-superforms/adapters';

export async function setStatusReview(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'reviewing' })
		.eq('id', id)
		.select()
		.single();
	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	return { form, opData };
}

export async function setStatusRevision(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'revision' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	return { form, opData };
}

export async function setStatusApproved(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'approved' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	return { form, opData };
}
