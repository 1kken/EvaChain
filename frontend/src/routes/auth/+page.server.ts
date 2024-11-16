import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { logInSchema, signupSchema } from './schema';
import { handle } from '../../hooks.server';

//PROPS passed down to +page.svelte
export const load: PageServerLoad = async () => {
	return {
		form: {
			logIn: await superValidate(zod(logInSchema)),
			signUp: await superValidate(zod(signupSchema))
		}
	};
};

//form Actions from +page.svelte
export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		// Server side validation
		const form = await superValidate(request, zod(signupSchema));
		// If not valid return the form with errors
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// If form valid, use the validated data from superValidate
		const { email, password, firstName, lastName } = form.data;

		function handleName(name: string): string {
			//remove all extra spaces then join with one space
			return name.toLowerCase().split(/\s+/).join(' ');
		}

		// Attempt signup with Supabase
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: handleName(firstName),
					last_name: handleName(lastName)
				}
			}
		});
		// If Supabase returns an error
		if (error) {
			console.error(error);
			// Return both the form and the error message
			return fail(400, {
				form,
				message: error.message
			});
		}

		// If success, return both form and success message
		return {
			form,
			success: true,
			message: 'Account created successfully! Please check your email.'
		};
	},
	login: async ({ request, locals: { supabase } }) => {
		// Server side validation
		const form = await superValidate(request, zod(logInSchema));
		// If not valid return the form with errors
		if (!form.valid) {
			console.log(form);
			return fail(400, {
				form
			});
		}

		// If form valid, use the validated data from superValidate
		const { email, password } = form.data;
		// Attempt signup with Supabase
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		// If Supabase returns an error
		if (error) {
			console.error(error);
			// Return both the form and the error message
			return fail(400, {
				form,
				message: error.message
			});
		}

		// If success, return both form and success message
		return {
			form,
			success: true,
			message: 'Log successful!'
		};
	}
};
