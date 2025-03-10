// src/routes/api/charts/headopu/ipcr_analysis/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const officeId = url.searchParams.get('officeId');

		if (!officeId) {
			return json({ error: 'Office ID is required' }, { status: 400 });
		}

		let intOfficeId = parseInt(officeId);
		if (isNaN(intOfficeId)) {
			return json({ error: 'Invalid office ID' }, { status: 400 });
		}

		// Query from the office_performance_history view
		let query = supabase
			.from('office_performance_history')
			.select('*')
			.eq('office_id', intOfficeId)
			.order('year', { ascending: false })
			.limit(6);

		const { data, error } = await query;

		if (error) {
			console.error('Error fetching office performance history data:', error);
			return json({ error: error.message }, { status: 500 });
		}

		// Return data in chronological order (oldest first)
		return json(data.reverse());
	} catch (err) {
		console.error('Unexpected error:', err);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
