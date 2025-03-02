import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get user_id from URL parameter
		const userId = url.searchParams.get('user_id');

		if (!userId) {
			return json({ error: 'user_id is required' }, { status: 400 });
		}

		// Query the database for user roles
		const { data: userRoles, error } = await supabase
			.from('user_roles')
			.select('*, roles(name)')
			.eq('user_id', userId)
			.limit(1);

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch user roles' }, { status: 500 });
		}

		return json({ data: userRoles });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
