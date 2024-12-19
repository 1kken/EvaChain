import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'op_header'>[] = await request.json();
		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('op_header')
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
		console.error('Error updating indicator positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
