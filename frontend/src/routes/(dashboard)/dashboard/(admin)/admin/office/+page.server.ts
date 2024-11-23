import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { titleCase } from 'title-case';
import {
	createOfficeSchema,
	deleteOfficeSchema,
	updateOfficeSchema,
	type CreateOffice,
	type DeleteOffice,
	type UpdateOffice
} from '$lib/schemas/office/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { error, type Actions } from '@sveltejs/kit';
export const load = (async ({ locals: { supabase } }) => {
	const { data: offices, error: officeError } = await supabase.from('office').select(
		`
		 	id,
			code,
			name,
			unit(id,code,name)
		`
	);

	if (officeError) {
		error(500, 'Unexpected error, fetching unit error');
	}

	const { data: units, error: unitError } = await supabase.from('unit').select();

	if (unitError) {
		error(500, 'Unexpected error, fetching unit error');
	}
	const createOfficeForm = await superValidate(zod(createOfficeSchema));
	const updateOfficeForm = await superValidate(zod(updateOfficeSchema));
	const deleteOfficeForm = await superValidate(zod(deleteOfficeSchema));
	return {
		offices,
		units,
		form: { createOfficeForm, updateOfficeForm, deleteOfficeForm }
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createoffice: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<CreateOffice, App.Superforms.Message>(
			request,
			zod(createOfficeSchema)
		);
		let { unit_id, name, code } = form.data;
		code = code.toUpperCase();
		name = titleCase(name);

		const { error: insertError } = await supabase.from('office').insert({ unit_id, code, name });

		if (insertError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${insertError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Office created ${name}`
		});
	},
	deleteoffice: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<DeleteOffice, App.Superforms.Message>(
			request,
			zod(deleteOfficeSchema)
		);
		let { id, name } = form.data;

		const { error } = await supabase.from('office').delete().eq('id', id);

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

	updateoffice: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<UpdateOffice>(request, zod(updateOfficeSchema));

		let { id, name, code, unit_id } = form.data;

		if (name) {
			name = titleCase(name);
		}

		const { error } = await supabase
			.from('office')
			.update({ name: name, code: code, unit_id: unit_id })
			.eq('id', id);

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
