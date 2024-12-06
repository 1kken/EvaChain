import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createCoreFunctionSchema,
	deleteCoreFunctionSchema,
	updateCoreFunctionSchema,
	type CreateCoreFunctionSchema,
	type DeleteCoreFunctionInput,
	type DeleteCoreFunctionSchema,
	type UpdateCoreFunctionSchema
} from './(components)/(data)/(schema)/core_function_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';

export const actions = {
	createcorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<CreateCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(createCoreFunctionSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		let { name, ipcr_teaching_id, unit, reviewer_id } = form.data;
		name = titleCase(name.toLocaleLowerCase());

		const { data: coreFunction, error: coreFunctionError } = await supabase
			.from('core_function')
			.insert({ name, ipcr_teaching_id, unit, reviewer_id })
			.select()
			.single();
		if (coreFunctionError) {
			return message(form, {
				status: 'error',
				text: `Error saving core function, ${coreFunctionError.message}`
			});
		}
		return { form, coreFunction };
	},
	deletecorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<DeleteCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(deleteCoreFunctionSchema)
		);
		const { id } = form.data;

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		const { error: deleteError, data: coreFunction } = await supabase
			.from('core_function')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (deleteError) {
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${deleteError.message}`
			});
		}
		return { form, coreFunction };
	},
	updatecorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<UpdateCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(updateCoreFunctionSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}
		let { id, name, reviewer_id, unit } = form.data;
		if (name) {
			name = titleCase(name.toLocaleLowerCase());
		}
		const { data: coreFunction, error: updateError } = await supabase
			.from('core_function')
			.update({ name, reviewer_id, unit })
			.eq('id', id)
			.select()
			.single();
		if (updateError) {
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${updateError.message}`
			});
		}
		return { form, coreFunction };
	}
} satisfies Actions;
