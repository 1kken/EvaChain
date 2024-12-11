import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const userId = session?.user.id;
	if (!userId) {
		throw error(404, 'Profile ID not found');
	}

	const { data: ipcrs, error: fetchError } = await supabase
		.from('ipcr')
		.select()
		.eq('owner_id', userId);

	if (fetchError) {
		error(500, "Something went wrong for fetching IPCR's");
	}

	return {
		ipcrs
	};
}) satisfies LayoutServerLoad;
