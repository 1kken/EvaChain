import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase, session } }) => {
	try {
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const indicatorId = url.searchParams.get('indicatorId');
		if (!indicatorId) {
			return json({ error: 'Indicator ID is required' }, { status: 400 });
		}

		const { data: indicators, error } = await supabase
			.from('op_header_indicators')
			.select('*')
			.eq('indicator_id', indicatorId)
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
