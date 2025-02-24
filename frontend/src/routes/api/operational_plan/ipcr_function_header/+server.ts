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
		const currentYear = new Date().getFullYear();
		const startOfYear = new Date(currentYear, 0, 1).toISOString(); // January 1st of current year
		const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999).toISOString(); // December 31st of current year

		// Modified approach to handle hierarchical access
		// We'll search for plans that match the user's context in any of these scenarios:
		// 1. Exact match on program_id, office_id, and unit_id (narrowest scope)
		// 2. Match on office_id and unit_id, with program_id either NULL or matching
		// 3. Match on unit_id only, with office_id and program_id either NULL or matching

		const { data: eligiblePlans, error: plansError } = await supabase
			.from('operational_plan')
			.select('id, unit_id, office_id, program_id, created_at')
			.eq('status', 'approved')
			.gte('created_at', startOfYear)
			.lte('created_at', endOfYear)
			.eq('unit_id', profile.unit_id!)
			.order('created_at', { ascending: false });

		if (plansError) {
			console.error('Database error (plans):', plansError);
			return json({ error: 'Failed to fetch eligible plans' }, { status: 500 });
		}

		if (!eligiblePlans || eligiblePlans.length === 0) {
			return json({ data: [] });
		}

		// Find the most relevant plan based on hierarchical matching
		const relevantPlans = eligiblePlans.filter((plan) => {
			// Exact match on all levels
			if (profile.program_id && plan.program_id === profile.program_id) {
				return true;
			}

			// Office level match (program is null in plan OR user has no program_id)
			if (profile.office_id && plan.office_id === profile.office_id) {
				if (!plan.program_id || !profile.program_id) {
					return true;
				}
			}

			// Unit level match (office and program are null in plan OR user has no office/program)
			if (!plan.office_id && !plan.program_id) {
				return true;
			}

			return false;
		});

		// If we have matching plans, sort by most specific match and most recent
		const sortedPlans = relevantPlans.sort((a, b) => {
			// First prioritize specificity (program > office > unit)
			const aSpecificity = (a.program_id ? 3 : 0) + (a.office_id ? 2 : 0) + (a.unit_id ? 1 : 0);
			const bSpecificity = (b.program_id ? 3 : 0) + (b.office_id ? 2 : 0) + (b.unit_id ? 1 : 0);

			if (aSpecificity !== bSpecificity) {
				return bSpecificity - aSpecificity; // Higher specificity first
			}

			// If same specificity, sort by most recent
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});

		const latestPlanId = sortedPlans.length > 0 ? sortedPlans[0].id : null;

		if (!latestPlanId) {
			return json({ data: [] });
		}

		// Now fetch headers for the selected plan
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
			.eq('operational_plan_id', latestPlanId)
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
