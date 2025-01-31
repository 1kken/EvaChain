import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const opcrFunctionId = url.searchParams.get('opcr_function_id');

		if (!opcrFunctionId) {
			return json({ error: 'OPCR function ID is required' }, { status: 400 });
		}

		const { data: categories, error } = await supabase
			.from('opcr_function_category')
			.select('*')
			.eq('opcr_function_id', opcrFunctionId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch categories' }, { status: 500 });
		}

		return json({ data: categories });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'opcr_function_category'>[] = await request.json();

		for (const item of items) {
			const { error } = await supabase
				.from('opcr_function_category')
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
		console.error('Error updating OPCR category positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
