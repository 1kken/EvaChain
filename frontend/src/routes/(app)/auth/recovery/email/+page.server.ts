import type { Actions, PageServerLoad } from './$types';
import { emailSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, type Infer } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(emailSchema))
	};
};

export const actions: Actions = {
	sendemail: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(emailSchema));
		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Please correct the errors below'
			});
		}

		const email = form.data.email;

		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: 'http://127.0.0.1:5173/auth/recovery/reset-password'
		});

		if (error) {
			return message(form, {
				status: 'error',
				text: `Error saving function , ${error.message}`
			});
		}

		return message(form, { status: 'success', text: 'Email sent successfully' });
	}
};
