import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export async function fetchAccomplishmentReportById(
	id: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error: errorFetch } = await supabase
		.from('accomplishment_report')
		.select()
		.eq('id', id)
		.single();
	if (errorFetch) {
		error(404, { message: errorFetch.message });
	}
	if (!data) throw new Error('Accomplishment Report not found');
	return data;
}

export async function fetchAccomplishmentProgramProjectById(
	id: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error: errorFetch } = await supabase
		.from('accomplishment_program_project')
		.select()
		.eq('accomplishment_report_id', id);
	if (errorFetch) {
		error(404, { message: errorFetch.message });
	}
	if (!data) throw new Error('Accomplishment Program Project not found');
	return data;
}

export async function fetchAccomplishmentMetricsById(
	id: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error: errorFetch } = await supabase
		.from('accomplishment_metrics')
		.select()
		.eq('accomplishment_program_project_id', id);
	if (errorFetch) {
		error(404, { message: errorFetch.message });
	}
	if (!data) throw new Error('Accomplishment Metrics not found');
	return data;
}

export interface Profile extends Tables<'profiles'> {
	position: Tables<'position'> | null;
	program: Tables<'program'> | null;
	unit: Tables<'unit'> | null;
	office: Tables<'office'> | null;
}

export async function fetchProfileById(
	owner_id: string,
	supabase: SupabaseClient<Database>
): Promise<Profile | null> {
	const { data, error: profileError } = await supabase
		.from('profiles')
		.select(
			`
     *,
     created_at,
     updated_at,
     position:position_id(id, name, created_at, updated_at, nature_of_work_id),
     program:program_id(id, name, created_at, updated_at, unit_id, office_id),
     unit:unit_id(id, name, code, created_at, updated_at),
     office:office_id(id, name, code, created_at, updated_at, unit_id)
   `
		)
		.eq('id', owner_id)
		.single();

	if (profileError) {
		error(404, { message: 'Profile not found' });
	}

	const transformedData = data
		? {
				...data,
				position: data.position || null,
				program: data.program || null,
				unit: data.unit || null,
				office: data.office || null
			}
		: null;

	return transformedData as Profile | null;
}
