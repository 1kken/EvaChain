import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handleOpApproval: Handle = async ({ event, resolve }) => {
	// Only apply checks to the operational plan routes
	if (event.url.pathname.startsWith('/dashboard/approval_request/operational_plan')) {
		// Only check permissions for GET requests (not for form actions/POST)
		if (event.request.method === 'GET') {
			// Check all permissions in parallel
			const [isPresident, isVp, isHead, isDean] = await Promise.all([
				event.locals.hasRole('president'),
				event.locals.hasRole('vice-president'),
				event.locals.hasRole('head_of_operating_unit'),
				event.locals.hasRole('dean')
			]);

			const canApprove = isPresident || isVp || isHead || isDean;

			if (!canApprove) {
				// Get referer for redirect or fall back to dashboard
				const referer = event.request.headers.get('referer');
				throw redirect(303, referer || '/dashboard');
			}
		}
	}

	return await resolve(event);
};
