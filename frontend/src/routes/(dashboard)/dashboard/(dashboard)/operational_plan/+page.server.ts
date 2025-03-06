import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import {
	createOperationalPlanSchema,
	updateOperationalPlanSchema
} from './(data)/operational_plan_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import {
	createOperationalPlan,
	deleteOperationalPlan,
	updateOperationalPlan
} from './(data)/op_services';
import { fetchOperationalPlanId, fetchStrategicPlanId } from './(data)/page_server_loader';

export const load = (async ({ locals: { supabase, session, hasRole, profile } }) => {
	try {
		const userId = session?.user.id;
		if (!userId) {
			error(401, 'Unauthorized');
		}

		if (!profile) {
			error(500, 'Failed to load user profile');
		}

		const [operationalPlanId, strategicPlanId] = await Promise.all([
			fetchOperationalPlanId(supabase, profile, hasRole),
			fetchStrategicPlanId(supabase, profile, hasRole)
		]);

		const [
			{ data: opData, error: fetchError },
			createOperationalPlanForm,
			updateOperationalPlanForm,
			deleteOperationalPlanForm
		] = await Promise.all([
			supabase.from('operational_plan').select('*').eq('creator_id', userId),
			superValidate(zod(createOperationalPlanSchema)),
			superValidate(zod(updateOperationalPlanSchema)),
			superValidate(zod(universalDeleteSchema))
		]);

		if (fetchError) {
			error(500, 'Failed to load operational plan data');
		}

		return {
			data: { opData, operationalPlanId, strategicPlanId },
			form: {
				createOp: createOperationalPlanForm,
				updateOp: updateOperationalPlanForm,
				deleteOp: deleteOperationalPlanForm
			}
		};
	} catch (e) {
		console.error('Error loading operational plan data:', e);
		error(500, 'Failed to load operational plan data');
	}
}) satisfies PageServerLoad;

//actions
export const actions = {
	createopNew: async ({ request, locals: { supabase, session, hasPermission } }) => {
		if (!session) {
			return { status: 401, body: 'Unauthorized' };
		}
		return createOperationalPlan(request, session, supabase, false, hasPermission);
	},
	createopFromPrevious: async ({ request, locals: { supabase, session, hasPermission } }) => {
		if (!session) {
			return { status: 401, body: 'Unauthorized' };
		}
		return createOperationalPlan(request, session, supabase, true, hasPermission);
	},
	deleteop: async ({ request, locals: { supabase } }) => {
		return deleteOperationalPlan(request, supabase);
	},
	updateop: async ({ request, locals: { supabase } }) => {
		return updateOperationalPlan(request, supabase);
	}
} satisfies Actions;
