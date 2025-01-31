import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const opcrFunctionId = url.searchParams.get('opcr_function_id');
		const opcrCategoryId = url.searchParams.get('opcr_function_category_id');

		if (!opcrFunctionId && !opcrCategoryId) {
			return json(
				{ error: 'Either opcr_function_id or opcr_function_category_id is required' },
				{ status: 400 }
			);
		}

		let query = supabase.from('opcr_indicator').select('*').order('position');

		if (opcrFunctionId) {
			query = query.eq('opcr_function_id', opcrFunctionId);
		}

		if (opcrCategoryId) {
			query = query.eq('opcr_function_category_id', opcrCategoryId);
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
		const items: Tables<'opcr_indicator'>[] = await request.json();

		for (const item of items) {
			const { error } = await supabase
				.from('opcr_indicator')
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
		console.error('Error updating OPCR indicator positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
