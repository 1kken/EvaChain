import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get op_header_id from URL parameter
		const opHeaderId = url.searchParams.get('op_header_id');

		if (!opHeaderId) {
			return json({ error: 'op_header_id is required' }, { status: 400 });
		}

		// Query the database for program projects
		const { data: programProjects, error } = await supabase
			.from('op_program_project')
			.select('*')
			.eq('op_header_id', opHeaderId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch program projects' }, { status: 500 });
		}
		return json({ data: programProjects });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'op_program_project'>[] = await request.json();
		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('op_program_project')
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
		console.error('Error updating program project positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
