import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const performanceIndicatorId = url.searchParams.get('performance_indicator_id');

		if (!performanceIndicatorId) {
			return json({ error: 'Performance Indicator ID is required' }, { status: 400 });
		}

		const { data: alignments, error } = await supabase
			.from('sdg_alignment')
			.select(
				`
        id,
        strat_plan_objective_id,
        strat_plan_performance_indicator_id,
        created_at,
        updated_at
      `
			)
			.eq('strat_plan_performance_indicator_id', performanceIndicatorId);

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch SDG alignments' }, { status: 500 });
		}

		return json({ data: alignments });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
