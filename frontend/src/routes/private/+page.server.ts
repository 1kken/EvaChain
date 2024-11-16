import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ depends, locals: { supabase, user } }) => {
	if (!user) {
		throw error(401, 'Unauthorized');
	}
	depends('supabase:db:profiles');
	const profile = await supabase
		.from('profiles')
		.select('id, first_name,updated_at,last_name')
		.eq('id', user.id) //cannot use user?.id
		.single();

	return { profile: profile ?? null };
};
