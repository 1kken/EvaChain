import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const indicatorId = url.searchParams.get('indicator_id');

		if (!indicatorId) {
			return json({ error: 'Indicator ID is required' }, { status: 400 });
		}

		const { data: accomplishments, error } = await supabase
			.from('ipcr_indicator_accomplishment')
			.select('*')
			.eq('ipcr_indicator_id', indicatorId)
			.order('accomplishment_date', { ascending: true });

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch accomplishments' }, { status: 500 });
		}

		return json({ data: accomplishments });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
