import type { PageServerLoad } from './$types';
import { fetchPopulationPieData } from './components/services/supervisor-scetion-services';

export const load = (async ({ locals: { supabase, profile, hasRole } }) => {
	if (!profile) {
		return { status: 401, redirect: '/login' };
	}

	try {
		// Fetch dashboard data using our service function
		const pieData = await fetchPopulationPieData(supabase, profile, hasRole);

		// Ensure we handle empty or undefined values
		return {
			pieData: pieData || []
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		return { status: 500, error: new Error('Unable to fetch dashboard') };
	}
}) satisfies PageServerLoad;
