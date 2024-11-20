import { redirect, type RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const {
			data: { session },
			error
		} = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			throw new Error('Google 0auth error!');
		}

		if (!error && session?.provider_token) {
			// Fetch Google profile
			const userResponse = await fetch(
				`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${session.provider_token}`
			);
			const userData = await userResponse.json();

			// Update Supabase profile
			const { error } = await supabase.from('profiles').upsert({
				id: session.user.id,
				first_name: userData.given_name,
				last_name: userData.family_name
			});

			if (error) {
				throw new Error('Setting user data google to db error');
			}

			throw redirect(303, `/${next.slice(1)}`);
		}
	}

	throw redirect(303, '/auth/auth-code-error');
};
