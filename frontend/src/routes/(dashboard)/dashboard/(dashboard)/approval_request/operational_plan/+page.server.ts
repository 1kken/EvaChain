import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { getActionForms } from './utils/server-loader';
import { set } from 'date-fns';
import { setStatusApproved, setStatusReview, setStatusRevision } from './utils/services';
import type { Tables } from '$lib/types/database.types';
export const load = (async ({ locals: { supabase, session, profile, hasRole } }) => {
	if (!session || !profile) throw redirect(303, '/login');
	if (profile.unit_id === null) throw redirect(303, '/dashboard');

	const [isPresident, isHeadOfOperatingUnit, isVicePresident, isDean] = await Promise.all([
		hasRole('president'),
		hasRole('head_of_operating_unit'),
		hasRole('vice-president'),
		hasRole('dean')
	]);

	let op: Tables<'operational_plan'>[] | [] = [];
	let opError = null;

	// Based on user's role, fetch the appropriate operational plans
	if (isPresident) {
		// President uses get_operational_plans_by_head_or_vp
		const result = await supabase.rpc('get_operational_plans_by_head_or_vp');
		op = result.data ?? [];
		opError = result.error;
	} else if (isHeadOfOperatingUnit || isVicePresident) {
		// Head of operating unit or VP uses get_operational_plans_by_unit_for_dean_or_head
		const result = await supabase.rpc('get_operational_plans_by_unit_for_dean_or_head', {
			p_unit_id: profile.unit_id
		});
		op = result.data ?? [];
		opError = result.error;
	} else if (isDean && profile.office_id) {
		// Dean uses get_operational_plans_by_office_for_program_chair
		const result = await supabase.rpc('get_operational_plans_by_office_for_program_chair', {
			p_office_id: profile.office_id
		});
		op = result.data ?? [];
		opError = result.error;
	}
	// For all other roles, op remains an empty array

	if (opError) {
		throw error(500, { message: 'Error fetching operational plans' });
	}

	const { data: offices, error: officeError } = await supabase
		.from('office')
		.select('code')
		.eq('unit_id', profile.unit_id);
	if (officeError) {
		throw error(500, { message: 'Error fetching offices' });
	}

	//forms
	const { revisionForm, uuidForm } = await getActionForms();
	return { op, offices, revisionForm, uuidForm };
}) satisfies PageServerLoad;

export const actions = {
	setstatusreview: async ({ request, locals: { supabase, session } }) => {
		if (!session) throw error(401, { message: 'Unauthorized' });
		return setStatusReview(request, supabase, session);
	},
	setstatusrevision: async ({ request, locals: { supabase, session } }) => {
		if (!session) throw error(401, { message: 'Unauthorized' });
		return setStatusRevision(request, supabase, session);
	},
	setstatusapproved: async ({ request, locals: { supabase, session } }) => {
		if (!session) throw error(401, { message: 'Unauthorized' });
		return setStatusApproved(request, supabase, session);
	}
} satisfies Actions;
