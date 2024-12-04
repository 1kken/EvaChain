import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createIPCRSchema,
	deleteIPCRSchema,
	type CreateIPCRSchema,
	type DeleteIPCRSchemanType
} from './(data)/schema.js';
import { type Actions } from '@sveltejs/kit';

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

		const { owner_id } = form.data;
		//check if the same user
		if (owner_id !== session?.user.id) {
			return message(form, {
				status: 'error',
				text: 'User is not the same in tehserver please refresh the page!'
			});
		}

		//fetch the user
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select()
			.eq('id', owner_id)
			.single();
		if (profileError) {
			return message(form, {
				status: 'error',
				text: 'Error fetching user profile, please log in again!'
			});
		}
		const { unit_id, office_id, program_id } = profile;
		//create a title
		const currentYear = new Date().getFullYear();
		const lastName = profile.last_name;
		const title = `${lastName}_${currentYear}_January_June`;
		//create the ipcr
		const { data: ipcrData, error: ipcrError } = await supabase
			.from('ipcr_teaching')
			.insert({ title, owner_id, unit_id, office_id, program_id })
			.select()
			.single();

		if (ipcrError) {
			return message(form, {
				status: 'error',
				text: 'Error creating IPCR!'
			});
		}

		return { form, ipcrData };
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
			.from('ipcr_teaching')
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
