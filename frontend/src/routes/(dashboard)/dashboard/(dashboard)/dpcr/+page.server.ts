import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDPCRByOwnerId, getDPCRForms } from './(data)/server_load_helper';
import { createDPCR, deleteDPCR, updateDPCR } from './(data)/dpcr_services';

export const load = (async ({ locals: { supabase, session } }) => {
	const userId = session?.user.id;
	if (!userId) {
		error(401, 'Unauthorized');
	}
	//data
	const dpcrs = getDPCRByOwnerId(userId, supabase);
	//forms
	const DPCRForms = await getDPCRForms();

	return {
		dpcrs,
		forms: {
			DPCRForms
		}
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createdpcr: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			error(401, 'Unauthorized');
		}
		return createDPCR(request, supabase, session.user.id);
	},
	updatedpcr: async ({ request, locals: { supabase } }) => {
		return updateDPCR(request, supabase);
	},
	deletedpcr: async ({ request, locals: { supabase } }) => {
		return deleteDPCR(request, supabase);
	}
};
