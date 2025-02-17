import { Tables } from '$lib/types/database.types';

export type OpHeaderFormResult = {
	form: any;
	opHeader: Tables<'op_header'>;
};

export type OpAnnualPlanFormResult = {
	form: any;
	opAnnualPlan: Tables<'op_annual_plan'>;
};

export type OpActivityFormResult = {
	form: any;
	opActivity: Tables<'op_activity'>;
};

export type OpIndicatorFormResult = {
	form: any;
	opIndicator: Tables<'op_activity_indicator'>;
};
