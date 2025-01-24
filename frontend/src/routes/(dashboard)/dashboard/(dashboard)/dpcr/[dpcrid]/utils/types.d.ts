import { Tables } from '$lib/types/database.types';

export type DPCRFunctionFormResult = {
	form: any;
	dpcrFunction: Tables<'dpcr_function'>;
};

export type DPCRCategoryFormResult = {
	form: any;
	dpcrCategory: Tables<'dpcr_function_category'>;
};

export type DPCRIndicatorFormResult = {
	form: any;
	dpcrIndicator: Tables<'dpcr_indicator'>;
};
