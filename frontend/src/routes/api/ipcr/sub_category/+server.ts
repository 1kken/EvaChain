import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		// Get ipcr_category_id from URL parameter
		const ipcrCategoryId = url.searchParams.get('ipcr_category_id');

		if (!ipcrCategoryId) {
			return json({ error: 'ipcr catergory id is required' }, { status: 400 });
		}

		// Query the database for activities
		const { data: subCategories, error } = await supabase
			.from('ipcr_function_sub_category')
			.select('*')
			.eq('ipcr_function_category_id', ipcrCategoryId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch sub categories' }, { status: 500 });
		}

		return json({ data: subCategories });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'ipcr_function_sub_category'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('ipcr_function_sub_category')
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
		console.error('Error updating IPCR sub-category positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
