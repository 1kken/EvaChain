import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const performanceIndicatorId = url.searchParams.get('performance_indicator_id');

		if (!performanceIndicatorId) {
			return json({ error: 'Performance Indicator ID is required' }, { status: 400 });
		}

		const { data: yearlyPlans, error } = await supabase
			.from('strat_plan_yearly_plan')
			.select(
				`
        id,
        strategy_plan_performance_indicator_id,
        year,
        target,
        budget,
        created_at,
        updated_at
      `
			)
			.eq('strategy_plan_performance_indicator_id', performanceIndicatorId);

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch yearly plans' }, { status: 500 });
		}

		return json({ data: yearlyPlans });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
