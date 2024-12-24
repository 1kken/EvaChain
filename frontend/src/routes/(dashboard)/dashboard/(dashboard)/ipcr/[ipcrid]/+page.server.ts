import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import {
	getCurrentIPCR,
	getCurrentIPCRFunction,
	getIPCRFunctionCategoryForms,
	getIPCRFunctionForms,
	getIPCRIndicatorForms
} from './utils/loader_services';
import {
	createIpcrFunction,
	deleteIpcrFunction,
	updateteIpcrFunction
} from './services/ipcr_function_services';
import {
	createIpcrFunctionCategory,
	deleteIpcrFunctionCategory,
	updateIpcrFunctionCategory
} from './services/ipcr_category_services';
import { createIpcrIndicator } from './services/ipcr_indicator_services';

export const load = (async ({ params, locals: { supabase } }) => {
	//states
	const ipcrFunction = await getCurrentIPCRFunction(params.ipcrid, supabase);
	const currentIpcr = await getCurrentIPCR(params.ipcrid, supabase);

	//forms
	const ipcrFunctionForm = await getIPCRFunctionForms();
	const ipcrFunctionCategoryForm = await getIPCRFunctionCategoryForms();
	const ipcrIndicatorForm = await getIPCRIndicatorForms();

	return {
		currentIpcr,
		ipcrFunction,
		ipcrFunctionForm,
		ipcrFunctionCategoryForm,
		ipcrIndicatorForm
	};
}) satisfies PageServerLoad;

export const actions = {
	//ipcr function
	createipcrfunction: async ({ request, locals: { supabase } }) => {
		return await createIpcrFunction(request, supabase);
	},
	updateipcrfunction: async ({ request, locals: { supabase } }) => {
		return await updateteIpcrFunction(request, supabase);
	},
	deleteipcrfunction: async ({ request, locals: { supabase } }) => {
		return await deleteIpcrFunction(request, supabase);
	},
	//ipcr function category
	createipcrfunctioncategory: async ({ request, locals: { supabase } }) => {
		return await createIpcrFunctionCategory(request, supabase);
	},
	updateipcrfunctioncategory: async ({ request, locals: { supabase } }) => {
		return await updateIpcrFunctionCategory(request, supabase);
	},
	deleteipcrfunctioncategory: async ({ request, locals: { supabase } }) => {
		return await deleteIpcrFunctionCategory(request, supabase);
	},
	//indicator
	createipcrindicator: async ({ request, locals: { supabase } }) => {
		return await createIpcrIndicator(request, supabase);
	}
} satisfies Actions;
