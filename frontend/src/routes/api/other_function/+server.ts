import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Tables } from '$lib/types/database.types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'other_function'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('other_function')
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
		console.error('Error:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
