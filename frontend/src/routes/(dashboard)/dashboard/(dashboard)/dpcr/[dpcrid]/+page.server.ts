import type { Actions, PageServerLoad } from './$types';
import {
	createDpcrCategory,
	deleteDpcrCategory,
	updateDpcrCategory
} from './services/category_services';
import {
	createDpcrFunction,
	updateDpcrFunction,
	deleteDpcrFunction
} from './services/function_services';
import {
	createDpcrIndicator,
	deleteDpcrIndicator,
	updateDpcrIndicator
} from './services/indicator_services';
import {
	fetchDPCR,
	fetchDpcrFunctionCategoryForms,
	fetchDpcrFunctionForms,
	fetchDpcrFunctionIndicatorForms,
	fetchDPCRFunctions
} from './utils/server_helper';

export const load = (async ({ params, locals: { supabase } }) => {
	const { dpcrid } = params;

	//data
	const dpcr = await fetchDPCR(dpcrid, supabase);
	const dpcrFunctions = await fetchDPCRFunctions(dpcrid, supabase);

	//forms
	const functionForms = await fetchDpcrFunctionForms();
	const categoryForms = await fetchDpcrFunctionCategoryForms();
	const indicatorForms = await fetchDpcrFunctionIndicatorForms();

	return {
		dpcr,
		dpcrFunctions,
		forms: {
			functionForms,
			categoryForms,
			indicatorForms
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	//dpcr function
	createdpcrfunction: async ({ request, locals: { supabase } }) => {
		return await createDpcrFunction(request, supabase);
	},
	updatedpcrfunction: async ({ request, locals: { supabase } }) => {
		return await updateDpcrFunction(request, supabase);
	},
	deletedpcrfunction: async ({ request, locals: { supabase } }) => {
		return await deleteDpcrFunction(request, supabase);
	},
	//dpcr category
	createdpcrcategory: async ({ request, locals: { supabase } }) => {
		return await createDpcrCategory(request, supabase);
	},
	updatedpcrcategory: async ({ request, locals: { supabase } }) => {
		return await updateDpcrCategory(request, supabase);
	},
	deletedpcrcategory: async ({ request, locals: { supabase } }) => {
		return await deleteDpcrCategory(request, supabase);
	},
	//dpcr indicator
	createindicator: async ({ request, locals: { supabase } }) => {
		return await createDpcrIndicator(request, supabase);
	},
	updateindicator: async ({ request, locals: { supabase } }) => {
		return await updateDpcrIndicator(request, supabase);
	},
	deleteindicator: async ({ request, locals: { supabase } }) => {
		return await deleteDpcrIndicator(request, supabase);
	}
} satisfies Actions;
