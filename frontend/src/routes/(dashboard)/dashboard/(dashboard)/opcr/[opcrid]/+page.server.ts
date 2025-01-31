import type { Actions, PageServerLoad } from './$types';
import {
	createOpcrCategory,
	deleteOpcrCategory,
	updateOpcrCategory
} from './services/category_services';
import {
	createOpcrFunction,
	deleteOpcrFunction,
	updateOpcrFunction
} from './services/function_services';
import {
	createOpcrIndicator,
	deleteOpcrIndicator,
	updateOpcrIndicator
} from './services/indicator_services';
import {
	fetchOPCR,
	fetchOpcrFunctionCategoryForms,
	fetchOpcrFunctionForms,
	fetchOpcrFunctionIndicatorForms,
	fetchOPCRFunctions
} from './utils/server_helper';

export const load = (async ({ params, locals: { supabase } }) => {
	const { opcrid } = params;

	//data
	const opcr = await fetchOPCR(opcrid, supabase);
	const opcrFunctions = await fetchOPCRFunctions(opcrid, supabase);

	//forms
	const functionForms = await fetchOpcrFunctionForms();
	const categoryForms = await fetchOpcrFunctionCategoryForms();
	const indicatorForms = await fetchOpcrFunctionIndicatorForms();

	return {
		opcr,
		opcrFunctions,
		forms: {
			functionForms,
			categoryForms,
			indicatorForms
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	//opcr function
	createopcrfunction: async ({ request, locals: { supabase } }) => {
		return await createOpcrFunction(request, supabase);
	},
	updateopcrfunction: async ({ request, locals: { supabase } }) => {
		return await updateOpcrFunction(request, supabase);
	},
	deleteopcrfunction: async ({ request, locals: { supabase } }) => {
		return await deleteOpcrFunction(request, supabase);
	},
	//dpcr category
	createopcrcategory: async ({ request, locals: { supabase } }) => {
		return await createOpcrCategory(request, supabase);
	},
	updateopcrcategory: async ({ request, locals: { supabase } }) => {
		return await updateOpcrCategory(request, supabase);
	},
	deleteopcrcategory: async ({ request, locals: { supabase } }) => {
		return await deleteOpcrCategory(request, supabase);
	},
	//dpcr indicator
	createindicator: async ({ request, locals: { supabase } }) => {
		return await createOpcrIndicator(request, supabase);
	},
	updateindicator: async ({ request, locals: { supabase } }) => {
		return await updateOpcrIndicator(request, supabase);
	},
	deleteindicator: async ({ request, locals: { supabase } }) => {
		return await deleteOpcrIndicator(request, supabase);
	}
} satisfies Actions;
