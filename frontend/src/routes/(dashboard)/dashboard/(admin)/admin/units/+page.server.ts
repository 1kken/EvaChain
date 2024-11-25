import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createUnitSchema,
	deleteUnitSchema,
	updateUnitSchema,
	type CreateUnit,
	type DeleteUnitSchema,
	type UpdateUnitSchema
} from '$lib/schemas/unit/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';

export const load = (async ({ locals: { supabase } }) => {
	const { data: units, error: unitError } = await supabase.from('unit').select();

	if (unitError) {
		error(500, 'Unexpected error, fetching unit error');
	}
	const createUnitForm = await superValidate(zod(createUnitSchema));
	const deleteUnitForm = await superValidate(zod(deleteUnitSchema));
	const updateUnitForm = await superValidate(zod(updateUnitSchema));

	return { units, form: { createUnitForm, deleteUnitForm, updateUnitForm } };
}) satisfies PageServerLoad;

export const actions: Actions = {
	createunit: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<Infer<CreateUnit>, App.Superforms.Message>(
			request,
			zod(createUnitSchema)
		);
		let { code, name } = form.data;
		code = code.toUpperCase();
		name = titleCase(name);

		const { error } = await supabase.from('unit').insert({ code, name });

		if (error) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, { status: 'success', text: `Sucessfully added ${form.data.name}` });
	},
	deleteunit: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<Infer<DeleteUnitSchema>, App.Superforms.Message>(
			request,
			zod(deleteUnitSchema)
		);

		let { id, name } = form.data;
		if (name) {
			name = titleCase(name);
		}
		const { error } = await supabase.from('unit').delete().eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'warning',
			text: `Succesfully deleted ${name} `
		});
	},

	updateunit: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<Infer<UpdateUnitSchema>, App.Superforms.Message>(
			request,
			zod(updateUnitSchema)
		);

		let { id, name, code } = form.data;
		if (name) {
			code = code?.toUpperCase();
			name = titleCase(name);
		}

		const { error } = await supabase.from('unit').update({ name: name, code: code }).eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Succesfully updated ${name}`
		});
	}
};
