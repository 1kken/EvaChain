import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handleOperationalPlanAccess: Handle = async ({ event, resolve }) => {
	// Only apply checks to the operational plan routes
	if (event.url.pathname.startsWith('/dashboard/operational_plan')) {
		// Only check permissions for GET requests (not for form actions/POST)
		if (event.request.method === 'GET') {
			// Check all permissions in parallel
			const [hasUnitPermission, hasOfficePermission, hasProgramPermission] = await Promise.all([
				event.locals.hasPermission('unit_create_operational_plan'),
				event.locals.hasPermission('office_create_operational_plan'),
				event.locals.hasPermission('program_create_operational_plan')
			]);

			if (!(hasUnitPermission || hasOfficePermission || hasProgramPermission)) {
				// Get referer for redirect or fall back to dashboard
				const referer = event.request.headers.get('referer');
				throw redirect(303, referer || '/dashboard');
			}
		}
	}

	return await resolve(event);
};
