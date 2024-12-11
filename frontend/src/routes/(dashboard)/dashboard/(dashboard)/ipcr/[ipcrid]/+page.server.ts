import { type Actions } from '@sveltejs/kit';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createIndicatorSchema,
	updateIndicatorSchema,
	type CreateIndicatorSchema,
	type UpdateIndicatorSchema
} from './utils/schemas/indicator_schema';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from './utils/schemas/universal_delete_schema';
import {
	createCoreFunction,
	deleteCoreFunction,
	updateCoreFunction
} from './utils/services/core-function-services';
import {
	createSubCoreFunction,
	deleteSubCoreFunction,
	updateSubCoreFunction
} from './utils/services/sub-core-function-service';

export const actions = {
	createcorefunction: async ({ request, locals: { supabase, session } }) => {
		return createCoreFunction(request, supabase);
	},

	deletecorefunction: async ({ request, locals: { supabase, session } }) => {
		return deleteCoreFunction(request, supabase);
	},

	updatecorefunction: async ({ request, locals: { supabase, session } }) => {
		return updateCoreFunction(request, supabase);
	},
	//sub core actions
	createsubcorefunction: async ({ request, locals: { supabase, session } }) => {
		return createSubCoreFunction(request, supabase);
	},

	deletesubcorefunction: async ({ request, locals: { supabase, session } }) => {
		return deleteSubCoreFunction(request, supabase);
	},

	updatesubcorefunction: async ({ request, locals: { supabase, session } }) => {
		return updateSubCoreFunction(request, supabase);
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
	},
	deleteindicator: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<UniversalDeleteSchema>, App.Superforms.Message>(
			request,
			zod(universalDeleteSchema)
		);
		const { id } = form.data;

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		const { error: deleteError, data: indicatorData } = await supabase
			.from('indicator')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (deleteError) {
			console.log(deleteError.message);
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${deleteError.message}`
			});
		}
		return { form, indicatorData };
	},
	updateindicator: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<UpdateIndicatorSchema>, App.Superforms.Message>(
			request,
			zod(updateIndicatorSchema)
		);
		const { id, indicator, accomplishment, accomplishment_date } = form.data;

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}
		console.log(id, indicator, accomplishment, accomplishment_date);
		const { error: updateError, data: indicatorData } = await supabase
			.from('indicator')
			.update({ indicator, accomplishment, accomplishment_date })
			.eq('id', id)
			.select()
			.single();

		if (updateError) {
			console.log(updateError.message);
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${updateError.message}`
			});
		}
		return { form, indicatorData };
	}
} satisfies Actions;
