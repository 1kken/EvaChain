import type { PageServerLoad } from './$types';

export const load = (async ({ params, locals: { supabase, session } }) => {
	console.log(params.ipcrid);
	return {};
}) satisfies PageServerLoad;
