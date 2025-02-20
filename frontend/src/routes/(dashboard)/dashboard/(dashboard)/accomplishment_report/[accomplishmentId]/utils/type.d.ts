import { Tables } from '$lib/types/database.types';

export type HeaderFormResult = {
	form: any;
	accHeader: Tables<'accomplishment_header'>;
};

export type AnnualPlanFormResult = {
	form: any;
	accAnnualPlan: Tables<'accomplishment_annual_plan'>;
};

export type ActivityFormResult = {
	form: any;
	accActivity: Tables<'accomplishment_activity'>;
};

export type ActivityIndicatorFormResult = {
	form: any;
	accIndicator: Tables<'accomplishment_activity_indicator'>;
};
