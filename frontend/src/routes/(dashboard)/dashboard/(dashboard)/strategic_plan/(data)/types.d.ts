import { Tables } from '$lib/types/database.types';

export type StrategicFormResult = {
	form: any;
	stratPlan: Tables<'strategic_plan'>;
};
