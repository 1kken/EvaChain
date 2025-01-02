import type { Actions, PageServerLoad } from './$types';
import {
	createAccomplishmentMetric,
	deleteAccomplishmentMetric,
	updateAccomplishmentMetric
} from './services/metrics_services';
import {
	createAccomplishmentProgramProject,
	deleteAccomplishmentProgramProject,
	updateAccomplishmentProgramProject
} from './services/program_project_services';
import {
	getAccomplishmentProgramProjectForms,
	getAccomplismentMetricsForms,
	getCurrentAccomplishmentReport,
	getProgramProjects
} from './utils/page_server_loader_helper';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const accomplishmentId = params.accomplishmentId;

	const accomplishmentReport = await getCurrentAccomplishmentReport(supabase, accomplishmentId);
	const programProjects = await getProgramProjects(supabase, accomplishmentId);

	//forms
	const programProjectForms = await getAccomplishmentProgramProjectForms();
	const metricsForms = await getAccomplismentMetricsForms();

	return {
		accomplishmentReport,
		programProjects,
		programProjectForms,
		metricsForms
	};
}) satisfies PageServerLoad;

export const actions = {
	createaccomplishmentprogramproject: async ({ request, locals: { supabase } }) => {
		return createAccomplishmentProgramProject(request, supabase);
	},
	deleteaccomplishmentprogramproject: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentProgramProject(request, supabase);
	},
	updateaccomplishmentprogramproject: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentProgramProject(request, supabase);
	},
	createmetric: async ({ request, locals: { supabase } }) => {
		return createAccomplishmentMetric(request, supabase);
	},
	deletemetric: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentMetric(request, supabase);
	},
	updatemetric: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentMetric(request, supabase);
	}
} satisfies Actions;
