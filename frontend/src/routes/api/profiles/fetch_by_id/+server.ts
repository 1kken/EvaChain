// routes/api/search/profiles/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		return json({ data: null });
	}

	try {
		const { data, error } = await locals.supabase
			.from('profiles')
			.select('id, first_name, last_name')
			.eq('id', id)
			.single();

		if (error) throw error;

		if (!data) {
			return json({ data: null });
		}

		return json({
			data: {
				id: data.id,
				display: `${data.first_name} ${data.last_name}`,
				firstName: data.first_name,
				lastName: data.last_name
			}
		});
	} catch (error) {
		console.error('Search error:', error);
		return json({ data: null }, { status: 500 });
	}
}) satisfies RequestHandler;
