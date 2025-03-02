import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { updateUserRoleSchema, type UpdateUserRoleSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

/**
 * Main function to update user role
 */
export async function updateUserRole(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateUserRoleSchema>, App.Superforms.Message>(
		request,
		zod(updateUserRoleSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { userId, role } = form.data;

	// First, check if the user already has a role
	const { data: existingRoles } = await supabase
		.from('user_roles')
		.select('id')
		.eq('user_id', userId);

	if (existingRoles && existingRoles.length > 0) {
		// User has an existing role - update it
		const { data, error } = await supabase
			.from('user_roles')
			.update({ role_id: parseInt(role) })
			.eq('user_id', userId)
			.select('id');

		if (error) {
			return message(form, { status: 'error', text: error.message });
		}
	} else {
		// User doesn't have a role yet - insert a new one
		const { error } = await supabase.from('user_roles').insert({
			user_id: userId,
			role_id: parseInt(role)
		});

		if (error) {
			return message(form, { status: 'error', text: error.message });
		}
	}
	console.log(form);
	return { form };
}
