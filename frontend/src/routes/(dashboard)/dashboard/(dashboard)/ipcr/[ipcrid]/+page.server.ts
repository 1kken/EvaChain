import { type Actions } from '@sveltejs/kit';
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
import {
	createIndicator,
	deleteIndicator,
	markIndicatorDone,
	updateIndicator
} from './utils/services/indicator-services';
import { submitIpcrAction } from './utils/services/ipcr-services';
import {
	createSupportFunction,
	deleteSupportFunction,
	updateSupportFunction
} from './utils/services/support-function-services';
import {
	createSubSupportFunction,
	deleteSubSupportFunction,
	updateSubSupportFunction
} from './utils/services/sub_support_function_services';
import {
	createOtherFunction,
	deleteOtherFunction,
	updateOtherFunction
} from './utils/services/other_function_services';
import {
	createSubOtherFunction,
	deleteSubOtherFunction,
	updateSubOtherFunction
} from './utils/services/sub_other_function_services';

export const actions = {
	//core function
	createcorefunction: async ({ request, locals: { supabase, session } }) => {
		return createCoreFunction(request, supabase);
	},
	deletecorefunction: async ({ request, locals: { supabase, session } }) => {
		return deleteCoreFunction(request, supabase);
	},
	updatecorefunction: async ({ request, locals: { supabase, session } }) => {
		return updateCoreFunction(request, supabase);
	},
	//sub core function
	createsubcorefunction: async ({ request, locals: { supabase, session } }) => {
		return createSubCoreFunction(request, supabase);
	},
	deletesubcorefunction: async ({ request, locals: { supabase, session } }) => {
		return deleteSubCoreFunction(request, supabase);
	},
	updatesubcorefunction: async ({ request, locals: { supabase, session } }) => {
		return updateSubCoreFunction(request, supabase);
	},
	//support function
	createsupportfunction: async ({ request, locals: { supabase, session } }) => {
		return createSupportFunction(request, supabase);
	},
	deletesupportfunction: async ({ request, locals: { supabase, session } }) => {
		return deleteSupportFunction(request, supabase);
	},
	updatesupportfunction: async ({ request, locals: { supabase, session } }) => {
		return updateSupportFunction(request, supabase);
	},
	//sub support function
	createsubsupportfunction: async ({ request, locals: { supabase, session } }) => {
		return createSubSupportFunction(request, supabase);
	},
	deletesubsupportfunction: async ({ request, locals: { supabase, session } }) => {
		return deleteSubSupportFunction(request, supabase);
	},
	updatesubsupportfunction: async ({ request, locals: { supabase, session } }) => {
		return updateSubSupportFunction(request, supabase);
	},
	//other function
	createotherfunction: async ({ request, locals: { supabase, session } }) => {
		return createOtherFunction(request, supabase);
	},
	deleteotherfunction: async ({ request, locals: { supabase, session } }) => {
		return deleteOtherFunction(request, supabase);
	},
	updateotherfunction: async ({ request, locals: { supabase, session } }) => {
		return updateOtherFunction(request, supabase);
	},
	//sub other function
	createsubotherfunction: async ({ request, locals: { supabase, session } }) => {
		return createSubOtherFunction(request, supabase);
	},
	deletesubotherfunction: async ({ request, locals: { supabase, session } }) => {
		return deleteSubOtherFunction(request, supabase);
	},
	updatesubotherfunction: async ({ request, locals: { supabase, session } }) => {
		return updateSubOtherFunction(request, supabase);
	},
	//indicator
	createindicator: async ({ request, locals: { supabase, session } }) => {
		return createIndicator(request, supabase);
	},

	deleteindicator: async ({ request, locals: { supabase, session } }) => {
		return deleteIndicator(request, supabase);
	},
	markindicatordone: async ({ request, locals: { supabase, session } }) => {
		return markIndicatorDone(request, supabase);
	},
	updateindicator: async ({ request, locals: { supabase, session } }) => {
		return updateIndicator(request, supabase);
	},
	//ipcr
	submitipcr: async ({ request, locals: { supabase, session } }) => {
		return submitIpcrAction(request, supabase);
	}
} satisfies Actions;
