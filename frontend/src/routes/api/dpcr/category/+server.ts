import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const dpcrFunctionId = url.searchParams.get('dpcr_function_id');

		if (!dpcrFunctionId) {
			return json({ error: 'DPCR function ID is required' }, { status: 400 });
		}

		const { data: categories, error } = await supabase
			.from('dpcr_function_category')
			.select('*')
			.eq('dpcr_function_id', dpcrFunctionId)
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
		const items: Tables<'dpcr_function_category'>[] = await request.json();

		for (const item of items) {
			const { error } = await supabase
				.from('dpcr_function_category')
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
		console.error('Error updating DPCR category positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
