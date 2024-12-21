import type { Actions, PageServerLoad } from './$types';
import { createOpHeader, deleteOpHeader, updateOpHeader } from './services/op_header_services';
import {
	getOpActivityForms,
	getOperationalPlan,
	getOpHeaderForms,
	getOpHeaders,
	getOpObjectiveForms,
	getOpProgramProjectForms
} from './utils/load_services';
import {
	createOpProgramProject,
	deleteOpProgramProject,
	updateOpProgramProject
} from './services/op_program_project_services';
import {
	createOpObjectives,
	deleteOpObjectives,
	updateOpObjectives
} from './services/op_objective_services';
import {
	createOpActivity,
	deleteOpActivity,
	updateOpActivity
} from './services/op_activity_services';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const { opid } = params;
	const operationalPlan = await getOperationalPlan(opid, supabase);
	const opHeaders = await getOpHeaders(opid, supabase);
	const opHeaderForms = await getOpHeaderForms();
	const opProgramProjectForms = await getOpProgramProjectForms();
	const opProgramObjectiveForms = await getOpObjectiveForms();
	const opActivityForms = await getOpActivityForms();
	return {
		operationalPlan,
		opHeaders,
		opHeaderForms,
		opProgramProjectForms,
		opProgramObjectiveForms,
		opActivityForms
	};
}) satisfies PageServerLoad;

export const actions = {
	createopheader: async ({ request, locals: { supabase, session } }) => {
		return createOpHeader(request, supabase);
	},
	deleteopheader: async ({ request, locals: { supabase, session } }) => {
		return deleteOpHeader(request, supabase);
	},
	updateopheader: async ({ request, locals: { supabase, session } }) => {
		return updateOpHeader(request, supabase);
	},
	// operational program and project
	createopprogramproject: async ({ request, locals: { supabase, session } }) => {
		return createOpProgramProject(request, supabase);
	},
	updateopprogramproject: async ({ request, locals: { supabase, session } }) => {
		return updateOpProgramProject(request, supabase);
	},
	deleteopprogramproject: async ({ request, locals: { supabase, session } }) => {
		return deleteOpProgramProject(request, supabase);
	},
	// operational objectives
	createopobjectives: async ({ request, locals: { supabase, session } }) => {
		return createOpObjectives(request, supabase);
	},
	updateopobjectives: async ({ request, locals: { supabase, session } }) => {
		return updateOpObjectives(request, supabase);
	},
	deleteopobjectives: async ({ request, locals: { supabase, session } }) => {
		return deleteOpObjectives(request, supabase);
	},
	//activities
	createopactivity: async ({ request, locals: { supabase, session } }) => {
		return createOpActivity(request, supabase);
	},
	updateopactivity: async ({ request, locals: { supabase, session } }) => {
		return updateOpActivity(request, supabase);
	},
	deleteopactivity: async ({ request, locals: { supabase, session } }) => {
		return deleteOpActivity(request, supabase);
	}
} satisfies Actions;
