import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchFunctionsBySupervisor, getIpcr, getOwnerProfile } from './utils/page-server';

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

	return {
		supervisorId,
		ipcr,
		ipcrFunctions,
		ownerProfile
	};
}) satisfies PageServerLoad;
