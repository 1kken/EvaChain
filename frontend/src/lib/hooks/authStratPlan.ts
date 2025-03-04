import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handleStratPlanAccess: Handle = async ({ event, resolve }) => {
	// Only apply checks to the operational plan routes
	if (event.url.pathname.startsWith('/dashboard/strategic_plan')) {
		// Only check permissions for GET requests (not for form actions/POST)
		if (event.request.method === 'GET') {
			// Check all permissions in parallel
			const hasPermissionCreateStrategicPlan =
				await event.locals.hasPermission('create_strategic_plan');

			if (!hasPermissionCreateStrategicPlan) {
				// Get referer for redirect or fall back to dashboard
				const referer = event.request.headers.get('referer');
				throw redirect(303, referer || '/dashboard');
			}
		}
	}

	return await resolve(event);
};
