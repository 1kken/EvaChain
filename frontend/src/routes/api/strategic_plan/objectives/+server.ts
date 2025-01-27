import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const planId = url.searchParams.get('plan_id');

		if (!planId) {
			return json({ error: 'Strategic Plan ID is required' }, { status: 400 });
		}

		const { data: objectives, error } = await supabase
			.from('strat_plan_objective')
			.select('*')
			.eq('strategic_plan_id', planId)
			.order('position');

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch strategic plan objectives' }, { status: 500 });
		}

		return json({ data: objectives });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
