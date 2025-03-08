import { createServerClient } from '@supabase/ssr';
import { error, type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Database } from '$lib/types/database.types';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { attachAuthHelpers } from '$lib/hooks/auth';
import { handleOperationalPlanAccess } from '$lib/hooks/authOplan';
import { handleOpcrAccess } from '$lib/hooks/authOPCR';
import { handleStratPlanAccess } from '$lib/hooks/authStratPlan';
import { handleAccReportAccess } from '$lib/hooks/authAccReport';
import { handleDpcrAccess } from '$lib/hooks/authDPCR';

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	// Get session
	const { session, user } = await event.locals.safeGetSession();

	if (session && user) {
		event.locals.session = session;
		event.locals.user = user;

		// Get profile with joins
		const { data: profile } = await event.locals.supabase
			.from('profiles')
			.select(
				`
        *,
        position:position_id(name),
        nature_of_work:nature_of_work_id(type),
        employee_status:employee_status_id(type)
      `
			)
			.eq('id', user.id)
			.single();

		if (profile) {
			event.locals.profile = profile;
		}
	}

	attachAuthHelpers(event);
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// Handle unauthenticated users
	if (!session) {
		if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/api')) {
			if (event.url.pathname.startsWith('/api')) {
				error(403, 'Unauthorized access');
			}
			redirect(303, '/auth');
		}
		return resolve(event); // Allow access to auth routes
	}

	// Handle authenticated users
	try {
		// Check admin status once per request
		const adminCheck = await event.locals.supabase.rpc('is_system_admin');
		const isAdmin = adminCheck.data === true;

		// Admin routing rules
		if (isAdmin) {
			if (!event.url.pathname.startsWith('/dashboard/admin')) {
				redirect(303, '/dashboard/admin');
			}
		} else {
			if (event.url.pathname.startsWith('/dashboard/admin')) {
				redirect(303, '/dashboard');
			}
		}
	} catch (err) {
		console.error('Admin check failed:', err);
		if (event.url.pathname.startsWith('/dashboard/admin')) {
			redirect(303, '/dashboard');
		}
	}

	// Redirect from auth pages when logged in
	if (event.url.pathname.startsWith('/auth')) {
		const adminCheck = await event.locals.supabase.rpc('is_system_admin');
		const isAdmin = adminCheck.data === true;
		redirect(303, isAdmin ? '/dashboard/admin' : '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(
	supabase,
	authGuard,
	handleOperationalPlanAccess,
	handleOpcrAccess,
	handleStratPlanAccess,
	handleAccReportAccess,
	handleDpcrAccess
);
