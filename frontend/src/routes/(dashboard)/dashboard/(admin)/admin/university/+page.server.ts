import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { createUnitSchema, type CreateUnit } from '$lib/schemas/unit/schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async ({ locals: { supabase } }) => {
	const { data: units, error: unitError } = await supabase.from('unit').select();
	if (unitError) {
		error(500, 'Unexpected error, fetching unit error');
	}

	return { units, form: await superValidate(zod(createUnitSchema)) };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createunit: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<Infer<CreateUnit>, App.Superforms.Message>(
			request,
			zod(createUnitSchema)
		);
		let { code, name } = form.data;
		code = code.toUpperCase();
		name = name.toLowerCase();

		const { error } = await supabase.from('unit').insert({ code, name });

		if (error) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, { status: 'success', text: `Sucessfully added ${form.data.name}` });
	}
};
