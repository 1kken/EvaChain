import { Tables } from '$lib/types/database.types';

export type OPCRFunctionFormResult = {
	form: any;
	opcrFunction: Tables<'opcr_function'>;
};

export type OPCRCategoryFormResult = {
	form: any;
	opcrCategory: Tables<'opcr_function_category'>;
};

export type OPCRIndicatorFormResult = {
	form: any;
	opcrIndicator: Tables<'opcr_indicator'>;
};
