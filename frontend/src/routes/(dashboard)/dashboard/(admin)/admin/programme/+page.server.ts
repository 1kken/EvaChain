import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	createProgrammeSchema,
	deleteProgrammeSchema,
	updateProgrammeSchema,
	type CreateProgramme
} from '$lib/schemas/programme/schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { titleCase } from 'title-case';

export const load = (async ({ locals: { supabase } }) => {
	const { data: programmes, error: programmeError } = await supabase.from('programme').select(`
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

	if (programmeError || officeError || unitError) {
		error(500, 'Unexpected error, fetching database');
	}

	const createProgrammeForm = await superValidate(zod(createProgrammeSchema));
	const deleteProgrammeForm = await superValidate(zod(deleteProgrammeSchema));
	const updateProgrammeForm = await superValidate(zod(updateProgrammeSchema));
	return {
		programmes,
		offices,
		units,
		updateProgrammeForm,
		deleteProgrammeForm,
		createProgrammeForm
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createprogramme: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<CreateProgramme, App.Superforms.Message>(
			request,
			zod(createProgrammeSchema)
		);
		console.log(form.data);
		let { unit_id, name, office_id } = form.data;
		name = titleCase(name);

		const { error: insertError } = await supabase
			.from('programme')
			.insert({ name: name, office_id: office_id, unit_id: unit_id });

		if (insertError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${insertError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Programme created ${name}`
		});
	}
};
