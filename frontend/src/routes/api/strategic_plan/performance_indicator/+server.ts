import type { Tables } from '$lib/types/database.types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const planId = url.searchParams.get('strategy_plan_id');

		if (!planId) {
			return json({ error: 'Strategy Plan ID is required' }, { status: 400 });
		}

		const { data: objectives, error } = await supabase
			.from('strategy_plan_performance_indicator')
			.select('*')
			.eq('strategy_plan_id', planId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch performance indicators' }, { status: 500 });
		}

		return json({ data: objectives });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const items: Tables<'strategy_plan_performance_indicator'>[] = await request.json();

		// Process each update sequentially
		for (const item of items) {
			const { error } = await supabase
				.from('strategy_plan_performance_indicator')
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
		console.error('Error updating performance indicator positions:', error);
		return json({ error: 'Failed to update positions' }, { status: 500 });
	}
};
