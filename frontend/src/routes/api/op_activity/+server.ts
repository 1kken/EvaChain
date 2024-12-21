import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get op_objective_id from URL parameter
		const objectiveId = url.searchParams.get('op_objective_id');

		if (!objectiveId) {
			return json({ error: 'op_objective_id is required' }, { status: 400 });
		}

		// Query the database for activities
		const { data: activities, error } = await supabase
			.from('op_activity')
			.select('*')
			.eq('op_objective_id', objectiveId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch activities' }, { status: 500 });
		}

		return json({ data: activities });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'op_activity'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('op_activity')
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
		console.error('Error updating activity positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
