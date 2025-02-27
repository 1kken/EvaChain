/**
 * This file is necessary to ensure protection of all routes in the `private`
 * directory. It makes the routes in this directory _dynamic_ routes, which
 * send a server request, and thus trigger `hooks.server.ts`.
 **/

import { fetchUserAuthData } from '../utils/userAuthHelper';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, session } }) => {
	const userId = session?.user?.id;
	if (!userId) {
		return { status: 401, redirect: '/login' };
	}
	const userAuthData = await fetchUserAuthData(supabase, userId);
	return { userId, userAuthData };
};
