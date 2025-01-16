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

export async function fetchOpProgramProjectByOpHeaderId(
	opHeaderId: string,
	supabase: SupabaseClient<Database>
) {
	const { data: opProgramProject, error } = await supabase
		.from('op_program_project')
		.select('*')
		.eq('op_header_id', opHeaderId);

	if (error) {
		throw new Error(error.message);
	}

	return opProgramProject;
}

export async function fetchOpObjectivesByOpProgramProjectId(
	opProgramProjectId: string,
	supabase: SupabaseClient<Database>
) {
	const { data: opObjectives, error } = await supabase
		.from('op_objective')
		.select('*')
		.eq('op_program_project_id', opProgramProjectId);

	if (error) {
		throw new Error(error.message);
	}

	return opObjectives;
}

export async function fetchOpActivitiesByOpObjectiveId(
	opObjectiveId: string,
	supabase: SupabaseClient<Database>
) {
	const { data: opActivities, error } = await supabase
		.from('op_activity')
		.select('*')
		.eq('op_objective_id', opObjectiveId);

	if (error) {
		throw new Error(error.message);
	}

	return opActivities;
}
