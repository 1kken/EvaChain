import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createCoreFunctionSchema,
	deleteCoreFunctionSchema,
	updateCoreFunctionSchema,
	type CreateCoreFunctionSchema,
	type DeleteCoreFunctionSchema,
	type UpdateCoreFunctionSchema
} from './(components)/(data)/(schema)/core_function_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	createSubCoreFunctionSchema,
	deleteSubCoreFunctionSchema,
	updateSubCoreFunctionSchema,
	type CreateSubCoreFunctionSchema,
	type DeleteSubCoreFunctionSchema,
	type UpdateSubCoreFunctionSchema
} from './(components)/(data)/(schema)/sub_core_function_schema';
import type CreateIndicatorDialog from './(components)/(indicator)/CreateIndicatorDialog.svelte';
import {
	createIndicatorSchema,
	type CreateIndicatorSchema
} from './(components)/(data)/indicator_schema';

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

		let { name, ipcr_teaching_id, unit, reviewer_id, position } = form.data;
		name = titleCase(name.toLocaleLowerCase());

		const { data: coreFunction, error: coreFunctionError } = await supabase
			.from('core_function')
			.insert({ name, ipcr_teaching_id, unit, reviewer_id, position })
			.select()
			.single();
		if (coreFunctionError) {
			if (coreFunctionError.code === '23505') {
				return message(form, {
					status: 'error',
					text: `Cannot have the same name for core functions!`
				});
			}
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
			if (updateError.code === '23505') {
				return message(form, {
					status: 'error',
					text: `Cannot have the same name for core functions!`
				});
			}
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${updateError.message}`
			});
		}
		return { form, coreFunction };
	},
	//sub core actions
	createsubcorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<CreateSubCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(createSubCoreFunctionSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		let { name, position, core_function_id } = form.data;
		name = titleCase(name.toLocaleLowerCase());

		const { data: subCoreFunction, error: errorSubCoreFunction } = await supabase
			.from('sub_core_function')
			.insert({ name, position, core_function_id })
			.select()
			.single();

		if (errorSubCoreFunction) {
			if (errorSubCoreFunction.code === '23505') {
				return message(form, {
					status: 'error',
					text: `Cannot have the same name for sub core functions!`
				});
			}
			return message(form, {
				status: 'error',
				text: `Error saving core function, ${errorSubCoreFunction.message}`
			});
		}
		return { form, subCoreFunction };
	},
	deletesubcorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<DeleteSubCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(deleteSubCoreFunctionSchema)
		);
		const { id } = form.data;

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		const { error: deleteError, data: subCoreFunction } = await supabase
			.from('sub_core_function')
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
		return { form, subCoreFunction };
	},
	updatesubcorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<UpdateSubCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(updateSubCoreFunctionSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}
		let { id, name } = form.data;
		if (name) {
			name = titleCase(name.toLocaleLowerCase());
		}
		const { data: subCoreFunction, error: updateError } = await supabase
			.from('sub_core_function')
			.update({ name })
			.eq('id', id)
			.select()
			.single();
		if (updateError) {
			if (updateError.code === '23505') {
				return message(form, {
					status: 'error',
					text: `Cannot have the same name for sub core functions!`
				});
			}
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${updateError.message}`
			});
		}
		return { form, subCoreFunction };
	},
	createindicator: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<CreateIndicatorSchema>, App.Superforms.Message>(
			request,
			zod(createIndicatorSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		let { indicator, core_function_id, sub_core_function_id, position } = form.data;

		const { data: indicatorData, error: indicatorError } = await supabase
			.from('indicator')
			.insert({ indicator, core_function_id, sub_core_function_id, position })
			.select()
			.single();
		if (indicatorError) {
			return message(form, {
				status: 'error',
				text: `Error saving core function, ${indicatorError.message}`
			});
		}
		return { form, indicatorData };
	}
} satisfies Actions;
