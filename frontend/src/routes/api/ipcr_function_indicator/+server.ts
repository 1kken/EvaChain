import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get ipcr_function_id from URL parameter
		const ipcrFunctionId = url.searchParams.get('ipcr_function_id');
		const ipcrCategoryId = url.searchParams.get('ipcr_category_id');
		const ipcrSubcategoryId = url.searchParams.get('ipcr_sub_category_id');

		// Query the database for objectives
		const query = supabase.from('ipcr_indicator').select('*').order('position');
		if (ipcrCategoryId) {
			query.eq('ipcr_function_category_id', ipcrCategoryId);
		}
		if (ipcrSubcategoryId) {
			query.eq('ipcr_function_sub_category_id', ipcrSubcategoryId);
		}
		if (ipcrFunctionId) {
			query.eq('ipcr_function_id', ipcrFunctionId);
		}
		const { data: functions, error } = await query;

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch categories' }, { status: 500 });
		}

		return json({ data: functions });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'ipcr_indicator'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('ipcr_indicator')
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
		console.error('Error updating function category positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
