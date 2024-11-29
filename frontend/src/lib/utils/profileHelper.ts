import type { Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const fetchOfficeByUnit = async (
	unitId: number | null,
	supabase: SupabaseClient
): Promise<Tables<'office'>[]> => {
	const { data, error } = await supabase.from('office').select('*').eq('unit_id', unitId);

	if (error) {
		throw error;
	}

	return data || [];
};

export const fetchProgramByOffice = async (
	officeId: number | null,
	supabase: SupabaseClient
): Promise<Tables<'program'>[]> => {
	const { data, error } = await supabase.from('program').select('*').eq('office_id', officeId);

	if (error) {
		throw error;
	}

	return data || [];
};

export const fetchPositionByNatureOfWork = async (
	natureOfWorkId: number | null,
	supabase: SupabaseClient
): Promise<Tables<'position'>[]> => {
	const { data, error } = await supabase
		.from('position')
		.select('*')
		.eq('nature_of_work_id', natureOfWorkId);

	if (error) {
		throw error;
	}

	return data || [];
};
