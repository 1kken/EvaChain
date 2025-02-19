import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { getActionForms } from './utils/server-loader';
import { set } from 'date-fns';
import { setStatusApproved, setStatusReview, setStatusRevision } from './utils/services';

export const load = (async ({ locals: { supabase, session, profile } }) => {
	if (!session || !profile) throw redirect(303, '/login');
	if (profile.unit_id === null) throw redirect(303, '/dashboard');

	const { data: op, error: opError } = await supabase
		.from('operational_plan')
		.select(
			`
   *,
   office:office_id (
     id,
     code,
     name
   )
 `
		)
		.eq('unit_id', profile.unit_id)
		.in('status', ['submitted', 'reviewing', 'revision', 'approved']);

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
	const form = await getActionForms();

	return { op, offices, form };
}) satisfies PageServerLoad;

export const actions = {
	setstatusreview: async ({ request, locals: { supabase } }) => {
		return setStatusReview(request, supabase);
	},
	setstatusrevision: async ({ request, locals: { supabase } }) => {
		return setStatusRevision(request, supabase);
	},
	setstatusapproved: async ({ request, locals: { supabase } }) => {
		return setStatusApproved(request, supabase);
	}
} satisfies Actions;
