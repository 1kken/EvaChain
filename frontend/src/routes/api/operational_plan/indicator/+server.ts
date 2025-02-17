import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get activity_id from URL parameter
		const activityId = url.searchParams.get('activity_id');

		if (!activityId) {
			return json({ error: 'Activity Id is Required' }, { status: 400 });
		}

		// Query the database for indicators
		const { data: indicators, error } = await supabase
			.from('op_activity_indicator')
			.select('*')
			.eq('op_activity_id', activityId)
			.order('position');

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

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'op_activity_indicator'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('op_activity_indicator')
				.update({
					position: item.position,
					updated_at: new Date().toISOString()
				})
				.eq('id', item.id);

			if (error) {
				throw error;
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error updating indicator positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
