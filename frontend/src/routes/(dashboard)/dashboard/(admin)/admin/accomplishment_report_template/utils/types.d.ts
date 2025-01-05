import { Tables } from '$lib/types/database.types';

export type ProgramProjectFormResult = {
	form: any;
	programProject: Tables<'accomplishment_template_program_project'>;
};

export type MetricsFormResult = {
	form: any;
	metrics: Tables<'accomplishment_template_metrics'>;
};
