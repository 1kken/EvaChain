import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const dpcrFunctionId = url.searchParams.get('dpcr_function_id');
		const dpcrCategoryId = url.searchParams.get('dpcr_function_category_id');

		if (!dpcrFunctionId && !dpcrCategoryId) {
			return json(
				{ error: 'Either dpcr_function_id or dpcr_function_category_id is required' },
				{ status: 400 }
			);
		}

		let query = supabase.from('dpcr_indicator').select('*').order('position');

		if (dpcrFunctionId) {
			query = query.eq('dpcr_function_id', dpcrFunctionId);
		}

		if (dpcrCategoryId) {
			query = query.eq('dpcr_function_category_id', dpcrCategoryId);
		}

		const { data: indicators, error } = await query;

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
		const items: Tables<'dpcr_indicator'>[] = await request.json();

		for (const item of items) {
			const { error } = await supabase
				.from('dpcr_indicator')
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
		console.error('Error updating DPCR indicator positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
