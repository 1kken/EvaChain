import type { PageServerLoad } from './$types';
import { error, type Actions } from '@sveltejs/kit';
import {
	getAccomplishmentMetricsTemplateForms,
	getAccomplishmentProgramProjectTemplateForms,
	getAccomplishmentTemplatePublishActionsForms,
	getTemplateAccReport,
	getTemplateProgramProjects
} from './utils/page_server_loader';
import {
	createTemplateProgramProject,
	deleteTemplateProgramProject,
	updateTemplateProgramProject
} from './services/program_project_services';
import {
	createAccomplishmentMetricTemplate,
	deleteAccomplishmentMetricTemplate,
	updateAccomplishmentMetricTemplate
} from './services/metrics_services';
import {
	publishAccomplishmentReportTemplate,
	unpublishAccomplishmentReportTemplate
} from './services/accomplishment_report_services';

export const load = (async ({ locals: { supabase } }) => {
	try {
		const [
			programProjects,
			accomplishmentReport,
			programProjectForms,
			metricForms,
			publishActionsForm
		] = await Promise.all([
			getTemplateProgramProjects(supabase),
			getTemplateAccReport(supabase),
			getAccomplishmentProgramProjectTemplateForms(),
			getAccomplishmentMetricsTemplateForms(),
			getAccomplishmentTemplatePublishActionsForms()
		]);

		return {
			programProjects,
			accomplishmentReport,
			forms: {
				publishActionsForm,
				programProjectForms: programProjectForms,
				metricForms: metricForms
			}
		};
	} catch (err) {
		throw error(500, 'Failed to load template data');
	}
}) satisfies PageServerLoad;

export const actions = {
	createaccomplishmentprogramproject: async ({ request, locals: { supabase } }) => {
		return createTemplateProgramProject(request, supabase);
	},
	deleteaccomplishmentprogramproject: async ({ request, locals: { supabase } }) => {
		return deleteTemplateProgramProject(request, supabase);
	},
	updateaccomplishmentprogramproject: async ({ request, locals: { supabase } }) => {
		return updateTemplateProgramProject(request, supabase);
	},
	createmetric: async ({ request, locals: { supabase } }) => {
		return createAccomplishmentMetricTemplate(request, supabase);
	},
	deletemetric: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentMetricTemplate(request, supabase);
	},
	updatemetric: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentMetricTemplate(request, supabase);
	},
	publishaccomplishmenttemplate: async ({ request, locals: { supabase } }) => {
		return publishAccomplishmentReportTemplate(request, supabase);
	},
	unpublishaccomplishmenttemplate: async ({ request, locals: { supabase } }) => {
		return unpublishAccomplishmentReportTemplate(request, supabase);
	}
} satisfies Actions;
