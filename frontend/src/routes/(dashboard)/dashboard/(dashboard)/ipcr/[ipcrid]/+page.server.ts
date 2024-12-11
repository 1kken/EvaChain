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
	submitipcr: async ({ request, locals: { supabase, session } }) => {
		return submitIpcrAction(request, supabase);
	}
} satisfies Actions;
