import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase, session } }) => {
	try {
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const headerId = url.searchParams.get('headerId');
		if (!headerId) {
			return json({ error: 'Header ID is required' }, { status: 400 });
		}

		// Get indicators through the hierarchy: header -> annual_plan -> activity -> indicator
		const { data: indicators, error } = await supabase
			.from('op_header_indicators')
			.select('*')
			.eq('header_id', headerId)
			.order('indicator_position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch indicators' }, { status: 500 });
		}

		return json({ data: indicators });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
