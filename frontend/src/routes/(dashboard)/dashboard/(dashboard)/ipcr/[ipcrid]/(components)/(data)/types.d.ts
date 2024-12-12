import type { Tables } from '$lib/types/database.types';

export type CoreFunctionFormResult = {
	form: any;
	core_function: Tables<'core_function'>;
};

export type SubCoreFunctionFormResult = {
	form: any;
	sub_core_function: Tables<'sub_core_function'>;
};

export type SupportFunctionFormResult = {
	form: any;
	support_function: Tables<'support_function'>;
};

export type SubSupportFunctionFormResult = {
	form: any;
	sub_support_function: Tables<'sub_support_function'>;
};

export type indicatorFormResult = {
	form: any;
	indicatorData: Tables<'indicator'>;
};

export type IPCRFormResult = {
	form: any;
	IpcrData: Tables<'ipcr_teaching'>;
};
