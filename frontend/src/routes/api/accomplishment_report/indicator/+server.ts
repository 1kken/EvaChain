import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get accomplishment_activity_id from URL parameter
		const activityId = url.searchParams.get('accomplishment_activity_id');

		if (!activityId) {
			return json({ error: 'accomplishment_activity_id is required' }, { status: 400 });
		}

		// Query the database for indicators
		const { data: indicators, error } = await supabase
			.from('accomplishment_activity_indicator')
			.select('*')
			.eq('accomplishment_activity_id', activityId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch accomplishment activity indicators' }, { status: 500 });
		}

		return json({ data: indicators });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'accomplishment_activity_indicator'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('accomplishment_activity_indicator')
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
