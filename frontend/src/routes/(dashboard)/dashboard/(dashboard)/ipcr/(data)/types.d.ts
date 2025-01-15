import { Tables } from '$lib/types/database.types';
export type IPCRFormResult = {
	form: any;
	ipcrData: Tables<'ipcr'>;
};
