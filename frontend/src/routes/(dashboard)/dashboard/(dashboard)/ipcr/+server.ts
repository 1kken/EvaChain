// src/routes/api/search/profiles/+server.ts
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const { search } = await request.json();

		if (!search || search.length < 3) {
			return json({ suggestions: [] });
		}

		const { data, error: supabaseError } = await supabase
			.from('profiles')
			.select('id, first_name, middle_name, last_name')
			.or(`first_name.ilike.%${search}%,middle_name.ilike.%${search}%,last_name.ilike.%${search}%`)
			.limit(5);

		if (supabaseError) {
			throw error(500, 'Error fetching profiles');
		}

		const suggestions =
			data?.map((profile) => ({
				id: profile.id,
				display: [
					profile.first_name,
					profile.middle_name ? `${profile.middle_name.charAt(0)}.` : '',
					profile.last_name
				]
					.filter(Boolean)
					.join(' ')
			})) || [];

		return json({ suggestions });
	} catch (err) {
		throw error(500, 'Internal server error');
	}
};
