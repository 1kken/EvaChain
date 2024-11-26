import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	createEmployeeStatusSchema,
	deleteEmployeeStatusSchema,
	updateEmployeeStatusSchema,
	type CreateEmployeeStatus,
	type DeleteEmployeeStatus,
	type UpdateEmployeeStatus
} from '$lib/schemas/employeestatus/schema';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';

export const load = (async ({ locals: { supabase } }) => {
	const { data: employeeStatus, error: errorEmployeeStatus } = await supabase
		.from('employee_status')
		.select();

	if (errorEmployeeStatus) {
		error(500, 'Unexpected error, fetching employee status error');
	}
	const createEpsForm = await superValidate(zod(createEmployeeStatusSchema));
	const deleteEpsForm = await superValidate(zod(deleteEmployeeStatusSchema));
	const updateEpsForm = await superValidate(zod(updateEmployeeStatusSchema));
	return {
		employeeStatus,
		form: { createEpsForm, deleteEpsForm, updateEpsForm }
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createeps: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<CreateEmployeeStatus, App.Superforms.Message>(
			request,
			zod(createEmployeeStatusSchema)
		);
		let { type } = form.data;
		type = titleCase(type);

		const { error: insertError } = await supabase.from('employee_status').insert({ type });

		if (insertError) {
			return message(form, {
				status: 'error',
				text: `Unexpected internal error please try again later! ${insertError.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Office created ${type}`
		});
	},
	deleteeps: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<DeleteEmployeeStatus, App.Superforms.Message>(
			request,
			zod(deleteEmployeeStatusSchema)
		);
		let { id, type } = form.data;

		const { error } = await supabase.from('employee_status').delete().eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'warning',
			text: `Succesfully deleted ${type} `
		});
	},

	updateeps: async ({ request, locals: { supabase } }) => {
		const form = await superValidate<UpdateEmployeeStatus, App.Superforms.Message>(
			request,
			zod(updateEmployeeStatusSchema)
		);
		let { id, type } = form.data;

		if (type) {
			type = titleCase(type);
		}

		const { error } = await supabase.from('employee_status').update({ type }).eq('id', id);

		if (error) {
			return message(form, {
				status: 'error',
				text: `unexpected internal error please try again later! ${error.message}`
			});
		}

		return message(form, {
			status: 'success',
			text: `Succesfully updated ${type}`
		});
	}
};
