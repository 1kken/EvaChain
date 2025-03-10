// src/routes/api/charts/headopu/accomplishment_analysis/+server.ts
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

		// Query the 5 latest accomplishment reports with their total average
		const { data, error } = await supabase
			.from('accomplishment_report_avg_rate')
			.select('id, title, created_at, total_accomplishment_rate')
			.eq('office_id', intOfficeId)
			.order('created_at', { ascending: false })
			.limit(5);

		if (error) {
			console.error('Error fetching accomplishment report data:', error);
			return json({ error: error.message }, { status: 500 });
		}

		return json(data);
	} catch (err) {
		console.error('Unexpected error:', err);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
