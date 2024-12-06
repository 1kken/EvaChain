import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	try {
		const userId = url.searchParams.get('userId');

		if (!userId) {
			throw error(400, 'User ID is required');
		}

		const { data: profile, error: supabaseError } = await supabase
			.from('profiles')
			.select(
				`
				id,
				employee_id,
				email,
				first_name,
				middle_name,
				last_name,
				avatar_url,
				unit_id,
				nature_of_work_id,
				office_id,
				program_id,
				position_id,
				employee_status_id,
				unit:unit_id (
					name
				),
				nature_of_work:nature_of_work_id (
					type
				),
				office:office_id (
					name
				),
				program:program_id (
					name
				),
				position:position_id (
					name
				),
				employee_status:employee_status_id (
					type
				)
			`
			)
			.eq('id', userId)
			.single();

		if (supabaseError) {
			throw error(500, 'Error fetching profile');
		}

		if (!profile) {
			throw error(404, 'Profile not found');
		}

		// Format the full name
		const formattedProfile = {
			...profile,
			full_name: [
				profile.first_name,
				profile.middle_name ? `${profile.middle_name.charAt(0)}.` : '',
				profile.last_name
			]
				.filter(Boolean)
				.join(' ')
		};

		return json({ profile: formattedProfile });
	} catch (err) {
		console.error('Error in GET profile:', err);
		throw error(500, 'Internal server error');
	}
};
