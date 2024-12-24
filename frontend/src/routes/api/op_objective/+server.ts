import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get op_program_project_id from URL parameter
		const programProjectId = url.searchParams.get('op_program_project_id');

		if (!programProjectId) {
			return json({ error: 'op_program_project_id is required' }, { status: 400 });
		}

		// Query the database for objectives
		const { data: objectives, error } = await supabase
			.from('op_objective')
			.select('*')
			.eq('op_program_project_id', programProjectId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch objectives' }, { status: 500 });
		}
		return json({ data: objectives });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'op_objective'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('op_objective')
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
		console.error('Error updating objective positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
