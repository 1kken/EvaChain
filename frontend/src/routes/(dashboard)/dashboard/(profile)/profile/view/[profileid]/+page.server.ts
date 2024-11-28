import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { profileSchema, profileSubmitSchema } from '$lib/schemas/profile/schema';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	if (!params.profileid) {
		throw error(404, 'Profile ID not found');
	}

	if (params.profileid !== session?.user.id) {
		throw error(401, 'Unauthorized you dont have access to this profile');
	}

	const { data: profile, error: err } = await supabase
		.from('profiles')
		.select()
		.eq('id', params.profileid)
		.single();

	if (err) {
		throw error(500, 'Failed to load profile');
	}

	if (!profile) {
		throw error(404, 'Profile not found');
	}

	const { data: units, error: unitErr } = await supabase.from('unit').select();

	if (unitErr) {
		throw error(500, 'Failed to load units');
	}

	const { data: natureOfWork, error: nowErr } = await supabase.from('nature_of_work').select();

	if (nowErr) {
		throw error(500, 'Failed to load nature of work');
	}

	const { data: employeeStatus, error: employeeStatusErr } = await supabase
		.from('employee_status')
		.select();

	if (employeeStatusErr) {
		throw error(500, 'Failed to load employee status');
	}

	return {
		profile,
		employeeStatus,
		units,
		natureOfWork,
		form: await superValidate(profile, zod(profileSchema))
	};
};

export const actions: Actions = {
	updateprofile: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate(request, zod(profileSubmitSchema));
		console.log(form.data.unit_id);
		// If not valid return the form with errors
		if (!form.valid) {
			console.log(form);
			return fail(400, {
				form
			});
		}
		const {
			first_name,
			last_name,
			middle_name,
			employee_id,
			unit_id,
			nature_of_work_id,
			office_id,
			program_id,
			position_id,
			employee_status_id
		} = form.data;

		if (!session?.user) {
			redirect(401, 'Unauthorized');
		}
		//update
		const { error } = await supabase
			.from('profiles')
			.update({
				first_name,
				last_name,
				middle_name,
				employee_id,
				unit_id,
				nature_of_work_id,
				office_id,
				program_id,
				position_id,
				employee_status_id
			})
			.eq('id', session?.user.id);
	},
	uploadImage: async ({ request, locals: { supabase, session } }) => {
		try {
			const formData = await request.formData();
			const image = formData.get('image');
			if (!image || !(image instanceof File)) {
				return fail(422, { message: 'Invalid input, input unporcessable' });
			}

			const { data, error } = await supabase.storage
				.from('avatars')
				.upload(`/${session?.user.id}/avatar${Date.now()}`, image, {
					cacheControl: '3600',
					upsert: true
				});

			const path = data?.path;
			if (!path) {
				return fail(500);
			}

			const { data: publicUrl } = await supabase.storage.from('avatars').getPublicUrl(path);

			if (!publicUrl) {
				return fail(500);
			}

			const { data: updateProf, error: updateProfErr } = await supabase
				.from('profiles')
				.update({ avatar_url: publicUrl.publicUrl })
				.eq('id', session!.user.id);

			if (updateProfErr) {
				return fail(500);
			}
			if (error) {
				return fail(500);
			}

			return publicUrl;
		} catch (error) {
			return fail(500);
		}
	}
};
