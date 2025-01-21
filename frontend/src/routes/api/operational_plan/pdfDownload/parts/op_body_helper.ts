import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchOpHeadersByOPId(
	opId: string,
	supabase: SupabaseClient<Database>
): Promise<Tables<'op_header'>[]> {
	const { data: opHeaders, error } = await supabase
		.from('op_header')
		.select('*')
		.eq('operational_plan_id', opId);

	if (error) {
		throw new Error(error.message);
	}

	return opHeaders;
}

export async function fetchOpAnnualPlanByOpHeaderId(
	opHeaderId: string,
	supabase: SupabaseClient<Database>
) {
	const { data: opProgramProject, error } = await supabase
		.from('op_annual_plan')
		.select('*')
		.eq('op_header_id', opHeaderId);

	if (error) {
		throw new Error(error.message);
	}

	return opProgramProject;
}

export async function fetchOpActivitiesByOpObjectiveId(
	annualPlanId: string,
	supabase: SupabaseClient<Database>
) {
	const { data: opActivities, error } = await supabase
		.from('op_activity')
		.select('*')
		.eq('op_annual_plan_id', annualPlanId);

	if (error) {
		throw new Error(error.message);
	}

	return opActivities;
}
