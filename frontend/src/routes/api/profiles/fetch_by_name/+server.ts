// routes/api/search/profiles/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals }) => {
	const query = url.searchParams.get('name');

	if (!query) {
		return json({ results: [] });
	}

	try {
		const { data, error } = await locals.supabase
			.from('profiles')
			.select('*')
			.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
			.order('first_name', { ascending: true })
			.limit(10);

		if (error) throw error;

		return json({
			results: data.map((profile) => ({
				id: profile.id,
				display: `${profile.first_name} ${profile.last_name}`,
				firstName: profile.first_name,
				lastName: profile.last_name
			}))
		});
	} catch (error) {
		console.error('Search error:', error);
		return json({ results: [] }, { status: 500 });
	}
}) satisfies RequestHandler;
