import { Tables } from '$lib/types/database.types';

export type OPFormResult = {
	form: any;
	opData: Tables<'operational_plan'>;
};
