import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get accomplishment_program_project_id from URL parameter
		const programProjectId = url.searchParams.get('accomplishment_program_project_id');

		if (!programProjectId) {
			return json({ error: 'accomplishment_program_project_id is required' }, { status: 400 });
		}

		// Query the database for metrics
		const { data: metrics, error } = await supabase
			.from('accomplishment_metrics')
			.select('*')
			.eq('accomplishment_program_project_id', programProjectId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch accomplishment metrics' }, { status: 500 });
		}

		return json({ data: metrics });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'accomplishment_metrics'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('accomplishment_metrics')
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
		console.error('Error updating metrics positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
