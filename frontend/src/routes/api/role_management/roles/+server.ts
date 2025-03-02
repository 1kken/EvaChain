import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	try {
		// Query the database for all roles
		const { data: roles, error } = await supabase.from('roles').select('*').order('name');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch roles' }, { status: 500 });
		}

		return json({ data: roles });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
