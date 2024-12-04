import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createIPCRSchema,
	deleteIPCRSchema,
	type CreateIPCRSchema,
	type DeleteIPCRSchemanType
} from './(data)/schema.js';
import { error, type Actions } from '@sveltejs/kit';
import { titleCase } from 'title-case';

export const load = async ({ params, locals: { supabase, session } }) => {
	const createIPCRForm = await superValidate(zod(createIPCRSchema));
	const deleteIPCRForm = await superValidate(zod(deleteIPCRSchema));

	return { form: { createIPCRForm, deleteIPCRForm } };
};

export const actions: Actions = {
	createipcr: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<CreateIPCRSchema>, App.Superforms.Message>(
			request,
			zod(createIPCRSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}
		let { title, owner_id, office_id, unit_id, program_id } = form.data;
		console.log(session?.user.id);
		console.log(owner_id);
		title = titleCase(title);
		if (session?.user.id !== owner_id) {
			return message(form, {
				status: 'error',
				text: 'Unauthorized creation of IPCR owner and currently logged in user is not match!'
			});
		}
		const { data: ipcr, error: savingError } = await supabase
			.from('ipcr')
			.insert({ title, owner_id, office_id, unit_id, program_id })
			.select()
			.single();

		if (savingError) {
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${savingError}`
			});
		}
		return { form, ipcr };
	},
	deleteipcr: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<DeleteIPCRSchemanType>, App.Superforms.Message>(
			request,
			zod(deleteIPCRSchema)
		);
		const { id } = form.data;

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		const { error: deleteError, data: deletedIPCR } = await supabase
			.from('ipcr')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (deleteError) {
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${deleteError}`
			});
		}
		return { form, deletedIPCR };
	}
};
