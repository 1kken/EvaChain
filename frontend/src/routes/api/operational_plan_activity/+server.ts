import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase, session } }) => {
	try {
		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}
		//fetch the profile base on session id
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session.user.id)
			.single();

		if (profileError) {
			console.error('Database error (profile):', profileError);
			return json({ error: 'Failed to fetch profile' }, { status: 500 });
		}

		// Get query parameters
		const textSearch = url.searchParams.get('text');
		const year = new Date(Date.now()).getFullYear();
		const programId = profile.program_id;
		const officeId = profile.office_id;
		const unitId = profile.unit_id;

		// Validate required parameters
		if (!year) {
			return json({ error: 'year is required' }, { status: 400 });
		}

		// Build date range
		const startDate = `${year}-01-01`;
		const endDate = `${year}-12-31`;

		// Query operational plans
		let query = supabase
			.from('operational_plan')
			.select('*')
			.gte('created_at', startDate)
			.lte('created_at', endDate);

		if (programId) query = query.eq('program_id', programId);
		if (officeId) query = query.eq('office_id', officeId);
		if (unitId) query = query.eq('unit_id', unitId);

		const { data: plans, error: plansError } = await query;

		if (plansError) {
			console.error('Database error (plans):', plansError);
			return json({ error: 'Failed to fetch operational plans' }, { status: 500 });
		}

		if (!plans || plans.length === 0) {
			return json({ data: [] });
		}

		// Fetch activities for all plans
		const planIds = plans.map((plan) => plan.id);
		const { data: activities, error: activitiesError } = await supabase
			.from('operational_plan_activities')
			.select('*')
			.in('operational_plan_id', planIds)
			.ilike('activity', `%${textSearch}%`)
			.order('header_position')
			.order('program_project_position')
			.order('objective_position')
			.order('activity_position')
			.limit(10);

		if (activitiesError) {
			console.error('Database error (activities):', activitiesError);
			return json({ error: 'Failed to fetch activities' }, { status: 500 });
		}

		// Group activities with their plans
		const plansWithActivities = plans.map((plan) => ({
			...plan,
			activities: activities?.filter((activity) => activity.operational_plan_id === plan.id) || []
		}));

		return json({ data: plansWithActivities });
	} catch (err) {
		console.error('Server error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
