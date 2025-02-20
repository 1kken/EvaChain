import { json, type RequestHandler } from '@sveltejs/kit';

function getCurrentQuarterDates(): { startDate: Date; endDate: Date } {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentQuarter = Math.floor(now.getMonth() / 3);

	const startDate = new Date(currentYear, currentQuarter * 3, 1);
	const endDate = new Date(currentYear, (currentQuarter + 1) * 3, 0);

	return { startDate, endDate };
}

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const indicatorId = url.searchParams.get('indicator_id');

		if (!indicatorId) {
			return json({ error: 'Indicator ID is required' }, { status: 400 });
		}

		const { startDate, endDate } = getCurrentQuarterDates();

		const { data: accomplishments, error } = await supabase
			.from('ipcr_indicator_accomplishment')
			.select('*')
			.eq('ipcr_indicator_id', indicatorId)
			.gte('created_at', startDate.toISOString())
			.lte('created_at', endDate.toISOString())
			.order('accomplishment_date', { ascending: true });

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch accomplishments' }, { status: 500 });
		}

		return json(accomplishments || []);
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
