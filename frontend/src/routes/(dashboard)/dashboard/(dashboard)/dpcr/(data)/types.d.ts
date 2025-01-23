import { Tables } from '$lib/types/database.types';

export type DPCRFormResult = {
	form: any;
	dpcr: Tables<'dpcr'>;
};
