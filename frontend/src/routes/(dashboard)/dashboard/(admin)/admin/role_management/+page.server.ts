import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { createRoleWithPermissionsSchema, updateRoleWithPermissionsSchema } from './(data)/schema';

export const load = (async ({ locals: { supabase } }) => {
	const { data: roles, error: rolesError } = await supabase.from('roles').select('*');

	const createForm = await superValidate(zod(createRoleWithPermissionsSchema));
	const updateForm = await superValidate(zod(updateRoleWithPermissionsSchema));
	const deleteForm = await superValidate(zod(universalDeleteSchema));

	if (rolesError) {
		error(401, { message: rolesError.message });
	}
	return {
		forms: {
			createForm,
			updateForm,
			deleteForm
		},
		roles
	};
}) satisfies PageServerLoad;

export const actions: Actions = {};
