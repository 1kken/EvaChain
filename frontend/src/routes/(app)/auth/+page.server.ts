import type { Actions, PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	logInSchema,
	signupSchema,
	type LogInSchemaInferred,
	type SignupSchemaInferred
} from './(data)/schema';
import { titleCase } from 'title-case';

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
		const form = await superValidate<SignupSchemaInferred, App.Superforms.Message>(
			request,
			zod(signupSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Sign up error please check your input!'
			});
		}

		let { email, password, firstName, lastName } = form.data;
		firstName = titleCase(firstName);
		lastName = titleCase(lastName);

		// Attempt signup with Supabase
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName
				}
			}
		});

		// If Supabase returns an error
		if (error) {
			return message(form, {
				status: 'error',
				text: `Error Signing up  ${error.message}`
			});
		}

		// If success, return both form and success message
		return message(form, {
			status: 'success',
			text: 'Account created successfully! Please check your email.'
		});
	},

	login: async ({ request, locals: { supabase } }) => {
		// Server side validation
		const form = await superValidate<LogInSchemaInferred, App.Superforms.Message>(
			request,
			zod(logInSchema)
		);
		// const form = await superValidate(request, zod(logInSchema));
		// If not valid return the form with errors
		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Log in error please check your input!'
			});
		}

		// If form valid, use the validated data from superValidate
		const { email, password } = form.data;
		// Attempt signup with Supabase
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		// If Supabase returns an error
		if (error) {
			return message(form, {
				status: 'error',
				text: `${error.message}`
			});
		}

		// If success, return both form and success message
		return message(form, {
			status: 'success',
			text: 'Log in successfull!'
		});
	}
};
