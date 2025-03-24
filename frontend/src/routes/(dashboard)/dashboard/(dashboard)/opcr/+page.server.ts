import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createOPCR, deleteOPCR, updateOPCR } from './(data)/opcr_services';
import { getOPCRByOwnerId, getOPCRForms } from './(data)/server_load_helper';

export const load = (async ({ locals: { supabase, session } }) => {
	const userId = session?.user.id;
	if (!userId) {
		error(401, 'Unauthorized');
	}
	//data
	const opcrs = getOPCRByOwnerId(userId, supabase);
	//forms
	const OPCRForms = await getOPCRForms();

	return {
		opcrs,
		forms: {
			OPCRForms
		}
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createopcr: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			error(401, 'Unauthorized');
		}
		return createOPCR(request, supabase, session.user.id);
	},
	updateopcr: async ({ request, locals: { supabase } }) => {
		return updateOPCR(request, supabase);
	},
	deleteopcr: async ({ request, locals: { supabase } }) => {
		return deleteOPCR(request, supabase);
	}
};
