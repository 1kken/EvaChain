import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals: { supabase, session } }) => {
	if (!params.userid) {
		throw error(404, 'Profile ID not found');
	}

	if (params.userid !== session?.user.id) {
		throw error(401, 'Unauthorized you dont have access to this profile');
	}

	const { data: ipcrs, error: fetchError } = await supabase
		.from('ipcr')
		.select()
		.eq('owner_id', params.userid);

	if (fetchError) {
		error(500, "Something went wrong for fetching IPCR's");
	}

	return {
		ipcrs
	};
}) satisfies LayoutServerLoad;
