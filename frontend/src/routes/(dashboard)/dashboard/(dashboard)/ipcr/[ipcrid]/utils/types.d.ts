import { Tables } from '$lib/types/database.types';

export type IPCRFunctionFormResult = {
	form: any;
	ipcrFunction: Tables<'ipcr_function'>;
};

export type IPCRFunctionCategoryFormResult = {
	form: any;
	ipcrFunctionCategory: Tables<'ipcr_function_category'>;
};

export type IPCRFunctionIndicatorFormResult = {
	form: any;
	ipcrFunctionIndicator: Tables<'ipcr_indicator'>;
};
