import type { Actions, PageServerLoad } from './$types';
import { fetchProfiles, getUpdateUserRolesForms } from './utils/page-server-loader';
import { updateUserRole } from './utils/services';

export const load = (async ({ locals: { supabase } }) => {
	const profileDetails = await fetchProfiles(supabase);
	const { updateForm } = await getUpdateUserRolesForms();
	return {
		profileDetails,
		updateForm
	};
}) satisfies PageServerLoad;

export const actions = {
	updateuserrole: async ({ request, locals: { supabase } }) => {
		return updateUserRole(request, supabase);
	}
} satisfies Actions;
