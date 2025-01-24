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

export async function fetchAccomplishmentHeadersById(
	id: string,
	supabase: SupabaseClient<Database>
): Promise<Tables<'accomplishment_header'>[]> {
	const { data, error: errorFetch } = await supabase
		.from('accomplishment_header')
		.select()
		.eq('accomplishment_report_id', id)
		.order('position', { ascending: true });

	if (errorFetch) {
		error(404, { message: errorFetch.message });
	}
	if (!data) throw new Error('Accomplishment Report Header not found');
	return data;
}

export async function fetchAnnualPlanByHeadersId(
	id: string,
	supabase: SupabaseClient<Database>
): Promise<Tables<'accomplishment_annual_plan'>[]> {
	const { data, error: errorFetch } = await supabase
		.from('accomplishment_annual_plan')
		.select()
		.eq('accomplishment_header_id', id)
		.order('position', { ascending: true });
	if (errorFetch) {
		error(404, { message: errorFetch.message });
	}
	if (!data) throw new Error('Annual Plan not found');
	return data;
}

export async function fetchActivitiesByAnnualPlanId(
	id: string,
	supabase: SupabaseClient<Database>
): Promise<Tables<'accomplishment_activity'>[]> {
	const { data, error: errorFetch } = await supabase
		.from('accomplishment_activity')
		.select()
		.eq('accomplishment_annual_plan_id', id)
		.order('position', { ascending: true });
	if (errorFetch) {
		error(404, { message: errorFetch.message });
	}
	if (!data) throw new Error('Activities not found');
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
