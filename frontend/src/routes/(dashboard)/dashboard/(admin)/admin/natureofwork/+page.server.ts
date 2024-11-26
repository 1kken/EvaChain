import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createNatureOfWorkSchema,
	deleteNatureOfWorkSchema,
	updateNatureOfWorkSchema,
	type CreateNatureOfWork,
	type DeleteNatureOfWork,
	type UpdateNatureOfWork
} from '$lib/schemas/natureofwork/schema';
import { titleCase } from 'title-case';

export const load = (async ({ locals: { supabase } }) => {
	const { data: natureOfWork, error: natureOfWorkError } = await supabase
		.from('nature_of_work')
		.select();

	if (natureOfWorkError) {
		error(500, 'Unexpected error, fetching nature of work error');
	}
	const createNowForm = await superValidate(zod(createNatureOfWorkSchema));
	const deleteNowForm = await superValidate(zod(deleteNatureOfWorkSchema));
	const updateNowForm = await superValidate(zod(updateNatureOfWorkSchema));

	return {
		natureOfWork,
		form: { createNowForm, deleteNowForm, updateNowForm }
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createnow: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<CreateNatureOfWork, App.Superforms.Message>(
			request,
			zod(createNatureOfWorkSchema)
		);
		let { type } = form.data;
		type = titleCase(type);

		const { error: insertError } = await supabase.from('nature_of_work').insert({ type });

		if (insertError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${insertError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Nature of work created ${type}`
		});
	},
	deletenow: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<DeleteNatureOfWork, App.Superforms.Message>(
			request,
			zod(deleteNatureOfWorkSchema)
		);
		let { id, type } = form.data;

		const { error } = await supabase.from('nature_of_work').delete().eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'warning',
			text: `Succesfully deleted ${type} `
		});
	},

	updatenow: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<UpdateNatureOfWork, App.Superforms.Message>(
			request,
			zod(updateNatureOfWorkSchema)
		);
		let { id, type } = form.data;

		if (type) {
			type = titleCase(type);
		}

		const { error } = await supabase.from('nature_of_work').update({ type }).eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Succesfully updated ${type}`
		});
	}
};
