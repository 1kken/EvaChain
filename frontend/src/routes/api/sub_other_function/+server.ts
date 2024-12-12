import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get other_function_id from URL parameter
		const otherFunctionId = url.searchParams.get('other_function_id');

		if (!otherFunctionId) {
			return json({ error: 'other_function_id is required' }, { status: 400 });
		}

		// Query the database for sub other functions
		const { data: subOtherFunctions, error } = await supabase
			.from('sub_other_function')
			.select('*')
			.eq('other_function_id', otherFunctionId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch sub other functions' }, { status: 500 });
		}

		return json({ data: subOtherFunctions });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'sub_other_function'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('sub_other_function')
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
		console.error('Error updating sub other function positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
