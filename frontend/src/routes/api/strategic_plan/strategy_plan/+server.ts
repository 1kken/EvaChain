import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { Tables } from '$lib/types/database.types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'strategy_plan'>[] = await request.json();

		for (const item of items) {
			const { error } = await supabase
				.from('strategy_plan')
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
		console.error('Error updating Strategy Plan positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
