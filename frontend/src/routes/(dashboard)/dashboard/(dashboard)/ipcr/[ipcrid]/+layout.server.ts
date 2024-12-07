import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import {
	createCoreFunctionSchema,
	deleteCoreFunctionSchema,
	updateCoreFunctionSchema
} from './(components)/(data)/(schema)/core_function_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createSubCoreFunctionSchema,
	deleteSubCoreFunctionSchema,
	updateSubCoreFunctionSchema
} from './(components)/(data)/(schema)/sub_core_function_schema';

export const load = (async ({ params, locals: { supabase, safeGetSession } }) => {
	const ipcrId = params.ipcrid;
	if (!ipcrId) {
		error(404, {
			message: 'IPCR id is missing'
		});
	}
	//core function forms
	const createCoreFunctionForm = await superValidate(zod(createCoreFunctionSchema));
	const deleteCoreFunctionForm = await superValidate(zod(deleteCoreFunctionSchema));
	const updateCoreFunctionForm = await superValidate(zod(updateCoreFunctionSchema));
	//sub core function forms
	const createSubCoreFunctionForm = await superValidate(zod(createSubCoreFunctionSchema));
	const deleteSubCoreFunctionForm = await superValidate(zod(deleteSubCoreFunctionSchema));
	const updateSubCoreFunctionForm = await superValidate(zod(updateSubCoreFunctionSchema));
	// core function fetch
	const { data: coreFunctions, error: coreFunctionError } = await supabase
		.from('core_function')
		.select()
		.eq('ipcr_teaching_id', ipcrId)
		.order('position');
	if (coreFunctionError) {
		error(500, { message: 'Something went wrong, please contact the developer' });
	}
	return {
		ipcrId,
		data: { coreFunctions },
		coreForms: { createCoreFunctionForm, deleteCoreFunctionForm, updateCoreFunctionForm },
		subCoreForms: {
			createSubCoreFunctionForm,
			deleteSubCoreFunctionForm,
			updateSubCoreFunctionForm
		}
	};
}) satisfies LayoutServerLoad;
