import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	createProgramSchema,
	deleteProgramSchema,
	updateProgramSchema,
	type CreateProgram,
	type DeleteProgram,
	type UpdateProgram
} from '$lib/schemas/program/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { titleCase } from 'title-case';

export const load = (async ({ locals: { supabase } }) => {
	const { data: programs, error: programError } = await supabase.from('program').select(`
	id,
	name,
	unit(id,code,name),
	office(id,unit_id,code,name)	
	`);
	const { data: offices, error: officeError } = await supabase.from('office').select(`
			id,
			code,
			name,
			unit(id,code,name)`);
	const { data: units, error: unitError } = await supabase.from('unit').select();

	if (programError || officeError || unitError) {
		error(500, 'Unexpected error, fetching database');
	}

	const createProgramForm = await superValidate(zod(createProgramSchema));
	const deleteProgramForm = await superValidate(zod(deleteProgramSchema));
	const updateProgramForm = await superValidate(zod(updateProgramSchema));
	return {
		programs,
		offices,
		units,
		updateProgramForm,
		deleteProgramForm,
		createProgramForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createprogram: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<CreateProgram, App.Superforms.Message>(
			request,
			zod(createProgramSchema)
		);

		let { unit_id, name, office_id } = form.data;
		name = titleCase(name);

		const { error: insertError } = await supabase
			.from('program')
			.insert({ name: name, office_id: office_id, unit_id: unit_id });

		if (insertError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${insertError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `program created ${name}`
		});
	},
	updateprogram: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<UpdateProgram, App.Superforms.Message>(
			request,
			zod(updateProgramSchema)
		);
		let { id, unit_id, name, office_id } = form.data;
		if (name) {
			name = titleCase(name);
		}
		const { error: updateError } = await supabase
			.from('program')
			.update({ unit_id, name, office_id })
			.eq('id', id);

		if (updateError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${updateError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `program updated ${name}`
		});
	},
	deleteprogram: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<DeleteProgram, App.Superforms.Message>(
			request,
			zod(deleteProgramSchema)
		);

		const { id, name } = form.data;

		const { error } = await supabase.from('program').delete().eq('id', id);

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
	}
};
