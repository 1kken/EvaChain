import { Tables } from '$lib/types/database.types';

export type OPCRFormResult = {
	form: any;
	opcr: Tables<'opcr'>;
};
