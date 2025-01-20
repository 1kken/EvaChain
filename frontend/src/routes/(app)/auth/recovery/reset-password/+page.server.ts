import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { passwordRecoverySchema } from './schema';
import { message, superValidate } from 'sveltekit-superforms';

export const load = (async () => {
	return {
		form: await superValidate(zod(passwordRecoverySchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	resetpassword: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(passwordRecoverySchema));
		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Please correct the errors below'
			});
		}

		const { password } = form.data;
		const { data, error } = await supabase.auth.updateUser({
			password: password
		});

		if (error) {
			return message(form, {
				status: 'error',
				text: error.message
			});
		}

		return message(form, { status: 'success', text: 'Password changed successfully!' });
	}
};
