import { superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createIPCRSchema, deleteIPCRSchema, updateIPCRSchema } from './(data)/schema.js';
import { error, type Actions } from '@sveltejs/kit';
import { createIPCR, deleteIPCR, updateIPCR } from './(data)/ipcr_services.js';
import { getOperationalPlanId } from './(data)/helper.js';

export const load = async ({ params, locals: { supabase, session } }) => {
	const createIPCRForm = await superValidate(zod(createIPCRSchema));
	const deleteIPCRForm = await superValidate(zod(deleteIPCRSchema));
	const updateIPCRForm = await superValidate(zod(updateIPCRSchema));

	const operationalPlanId = await getOperationalPlanId(session, supabase);
	return {
		operationalPlanId,
		form: { createIPCRForm, deleteIPCRForm, updateIPCRForm }
	};
};

export const actions: Actions = {
	createipcr: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			error(401, 'Unauthorized');
		}
		return createIPCR(request, supabase, session);
	},
	updateipcr: async ({ request, locals: { supabase, session } }) => {
		return updateIPCR(request, supabase);
	},
	deleteipcr: async ({ request, locals: { supabase, session } }) => {
		return deleteIPCR(request, supabase);
	}
};
