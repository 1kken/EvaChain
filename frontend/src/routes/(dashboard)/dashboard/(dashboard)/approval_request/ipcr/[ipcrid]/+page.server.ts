import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	fetchFunctionsBySupervisor,
	getImmediateSupervisor,
	getIpcr,
	getIPCRIndicatorForms,
	getOwnerProfile
} from './utils/page-server';
import { updateIpcrIndicator } from './services/indicator_services';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const ipcrId = params.ipcrid;
	if (!session) {
		redirect(401, '/login');
	}

	const supervisorId = session.user?.id;

	if (!ipcrId) {
		error(400, { message: 'Invalid IPCR ID' });
	}

	const ipcr = await getIpcr(ipcrId, supabase);
	const ipcrFunctions = await fetchFunctionsBySupervisor(ipcrId, supervisorId, supabase);
	const ownerProfile = await getOwnerProfile(ipcr.owner_id!, supabase);
	const indicatorForm = await getIPCRIndicatorForms();
	const immediateSupervisorStatus = await getImmediateSupervisor(ipcrId, session, supabase);

	return {
		supervisorId,
		ipcr,
		ipcrFunctions,
		ownerProfile,
		immediateSupervisorStatus,
		forms: {
			indicatorForm
		}
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateindicator: async ({ request, params, locals: { supabase } }) => {
		return updateIpcrIndicator(request, supabase);
	}
};
