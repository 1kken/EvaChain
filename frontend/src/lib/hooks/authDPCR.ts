import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handleOpcrAccess: Handle = async ({ event, resolve }) => {
	// Only apply checks to the operational plan routes
	if (event.url.pathname.startsWith('/dashboard/dpcr')) {
		// Only check permissions for GET requests (not for form actions/POST)
		if (event.request.method === 'GET') {
			// Check all permissions in parallel
			const hasPermissionCreateOpcr = await event.locals.hasPermission('create_dpcr');

			if (!hasPermissionCreateOpcr) {
				// Get referer for redirect or fall back to dashboard
				const referer = event.request.headers.get('referer');
				throw redirect(303, referer || '/dashboard');
			}
		}
	}

	return await resolve(event);
};
