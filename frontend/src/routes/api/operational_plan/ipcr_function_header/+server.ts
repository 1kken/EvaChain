import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase, session } }) => {
	try {
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Fetch the profile based on session id
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.single();

		if (profileError) {
			console.error('Database error (profile):', profileError);
			return json({ error: 'Failed to fetch profile' }, { status: 500 });
		}

		// First get the latest approved operational plan id
		let planQuery = supabase
			.from('operational_plan')
			.select('id')
			.eq('status', 'approved')
			.order('created_at', { ascending: false })
			.limit(1);

		// Apply filters based on user's profile
		if (profile.program_id) {
			planQuery = planQuery.eq('program_id', profile.program_id);
		}
		if (profile.office_id) {
			planQuery = planQuery.eq('office_id', profile.office_id);
		}
		if (profile.unit_id) {
			planQuery = planQuery.eq('unit_id', profile.unit_id);
		}

		const { data: latestPlan, error: planError } = await planQuery;

		if (planError) {
			console.error('Database error (plan):', planError);
			return json({ error: 'Failed to fetch latest plan' }, { status: 500 });
		}

		if (!latestPlan || latestPlan.length === 0) {
			return json({ data: [] });
		}

		// Now fetch headers for the latest approved plan
		const { data: headers, error: headersError } = await supabase
			.from('op_header')
			.select(
				`
        *,
        operational_plan:operational_plan_id(
          id,
          unit_id,
          office_id, 
          program_id,
          status,
          created_at
        )
      `
			)
			.eq('operational_plan_id', latestPlan[0].id)
			.order('position');

		if (headersError) {
			console.error('Database error (headers):', headersError);
			return json({ error: 'Failed to fetch headers' }, { status: 500 });
		}

		return json({ data: headers || [] });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
