import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, locals }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		return json({ data: null });
	}

	try {
		const { data, error } = await locals.supabase
			.from('op_activity')
			.select('id,activity')
			.eq('id', id)
			.single();

		if (error) throw error;

		if (!data) {
			return json({ data: null });
		}

		return json({
			data: {
				id: data.id,
				activity: data.activity
			}
		});
	} catch (error) {
		console.error('Search error:', error);
		return json({ data: null }, { status: 500 });
	}
}) satisfies RequestHandler;
