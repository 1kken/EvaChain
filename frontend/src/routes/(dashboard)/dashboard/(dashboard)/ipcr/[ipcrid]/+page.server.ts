import type { Actions, PageServerLoad } from './$types';
import {
	getCurrentIPCR,
	getCurrentIPCRFunction,
	getIPCRFunctionCategoryForms,
	getIPCRFunctionForms,
	getIPCRFunctionSubCategoryForms,
	getIPCRIndicatorAccomplishmentForms,
	getIPCRIndicatorForms,
	getIPCRSubmitForm
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
import {
	createAccomplishment,
	createIpcrIndicator,
	deleteIpcrIndicator,
	updateAccomplishment,
	updateIpcrIndicator
} from './services/ipcr_indicator_services';
import {
	createIpcrFunctionSubCategory,
	deleteIpcrFunctionSubCategory,
	updateIpcrFunctionSubCategory
} from './services/ipcr_sub_category_services';
import { submitIpcr } from './services/ipcr_submit_services';

export const load = (async ({ params, locals: { supabase } }) => {
	//states
	const ipcrFunction = await getCurrentIPCRFunction(params.ipcrid, supabase);
	const currentIpcr = await getCurrentIPCR(params.ipcrid, supabase);

	//forms
	const ipcrFunctionForm = await getIPCRFunctionForms();
	const ipcrFunctionCategoryForm = await getIPCRFunctionCategoryForms();
	const ipcrFunctionSubCategoryForm = await getIPCRFunctionSubCategoryForms();
	const ipcrIndicatorForm = await getIPCRIndicatorForms();
	const ipcrSubmitForm = await getIPCRSubmitForm();
	const ipcrAccomplishmentForm = await getIPCRIndicatorAccomplishmentForms();

	return {
		currentIpcr,
		ipcrFunction,
		ipcrFunctionForm,
		ipcrFunctionCategoryForm,
		ipcrFunctionSubCategoryForm,
		ipcrIndicatorForm,
		ipcrSubmitForm,
		ipcrAccomplishmentForm
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
	//ipcr function sub category
	createipcrfunctionsubcategory: async ({ request, locals: { supabase } }) => {
		return await createIpcrFunctionSubCategory(request, supabase);
	},
	updateipcrfunctionsubcategory: async ({ request, locals: { supabase } }) => {
		return await updateIpcrFunctionSubCategory(request, supabase);
	},
	deleteipcrfunctionsubcategory: async ({ request, locals: { supabase } }) => {
		return await deleteIpcrFunctionSubCategory(request, supabase);
	},
	//indicator
	createipcrindicator: async ({ request, locals: { supabase } }) => {
		return await createIpcrIndicator(request, supabase);
	},
	updateipcrindicator: async ({ request, locals: { supabase } }) => {
		return await updateIpcrIndicator(request, supabase);
	},
	deleteipcrindicator: async ({ request, locals: { supabase } }) => {
		return await deleteIpcrIndicator(request, supabase);
	},
	//adding accomplishments
	createaccomplishment: async ({ request, locals: { supabase } }) => {
		return await createAccomplishment(request, supabase);
	},
	updateaccomplishment: async ({ request, locals: { supabase } }) => {
		return await updateAccomplishment(request, supabase);
	},
	//ipcr
	submitipcr: async ({ request, locals: { supabase } }) => {
		return submitIpcr(request, supabase);
	}
} satisfies Actions;
