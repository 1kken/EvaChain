import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createPositionSchema,
	deletePositionSchema,
	updatePositionSchema,
	type CreatePosition,
	type DeletePosition,
	type UpdatePosition
} from '$lib/schemas/position/schema';
import { titleCase } from 'title-case';

export const load = (async ({ locals: { supabase } }) => {
	const { data: positions, error: positionError } = await supabase.from('position').select(
		`
			id,
			name,
			nature_of_work(id,type)
		`
	);

	if (positionError) {
		error(500, 'Unexpected error, fetching unit error');
	}

	const { data: nows, error: nowsError } = await supabase.from('nature_of_work').select();

	if (nowsError) {
		error(500, 'Unexpected error, fetching nature of work error');
	}

	const createPositionForm = await superValidate(zod(createPositionSchema));
	const updatePositionForm = await superValidate(zod(updatePositionSchema));
	const deletePositionForm = await superValidate(zod(deletePositionSchema));
	return {
		positions,
		nows,
		form: { createPositionForm, updatePositionForm, deletePositionForm }
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createposition: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<CreatePosition, App.Superforms.Message>(
			request,
			zod(createPositionSchema)
		);
		let { name, nature_of_work_id } = form.data;
		name = titleCase(name);

		const { error: insertError } = await supabase
			.from('position')
			.insert({ name, nature_of_work_id });

		if (insertError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${insertError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Position created ${name}`
		});
	},
	deleteposition: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<DeletePosition, App.Superforms.Message>(
			request,
			zod(deletePositionSchema)
		);
		let { id, name } = form.data;

		const { error } = await supabase.from('position').delete().eq('id', id);

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

	updateposition: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<UpdatePosition, App.Superforms.Message>(
			request,
			zod(updatePositionSchema)
		);
		let { id, name, nature_of_work_id } = form.data;

		if (name) {
			name = titleCase(name);
		}

		const { error } = await supabase
			.from('position')
			.update({ name, nature_of_work_id })
			.eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Succesfully updated position ${name}`
		});
	}
};
