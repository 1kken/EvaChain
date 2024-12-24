import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createIPCRSchema,
	deleteIPCRSchema,
	type CreateIPCRSchema,
	type DeleteIPCRSchemanType
} from './(data)/schema.js';
import { error, type Actions } from '@sveltejs/kit';
import { createIPCR, deleteIPCR } from './(data)/ipcr_services.js';

export const load = async ({ params, locals: { supabase, session } }) => {
	const createIPCRForm = await superValidate(zod(createIPCRSchema));
	const deleteIPCRForm = await superValidate(zod(deleteIPCRSchema));

	return { form: { createIPCRForm, deleteIPCRForm } };
};

export const actions: Actions = {
	createipcr: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			error(401, 'Unauthorized');
		}
		return createIPCR(request, supabase, session);
	},
	deleteipcr: async ({ request, locals: { supabase, session } }) => {
		return deleteIPCR(request, supabase);
	}
};
