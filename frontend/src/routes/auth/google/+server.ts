import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: new URL('/auth/callback', url.origin).toString() + '?next=/dashboard'
		}
	});

	if (data.url) {
		throw redirect(307, data.url); // use the redirect API for your server framework
	}

	redirect(307, 'auth/error');
};
