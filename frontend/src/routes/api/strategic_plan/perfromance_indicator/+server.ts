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
