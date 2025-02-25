import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export async function getIpcr(ipcrId: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('ipcr')
		.select()
		.eq('id', ipcrId)
		.single();
	if (fetchError) {
		error(500, { message: fetchError.message });
	}

	return data;
}

export async function fetchFunctionsBySupervisor(
	ipcrId: string,
	supervisorId: string,
	supabase: SupabaseClient<Database>
) {
	const { data, error } = await supabase.rpc('get_ipcr_functions_by_supervisor', {
		p_ipcr_id: ipcrId,
		p_supervisor_id: supervisorId
	});

	if (error) {
		console.error('Error fetching functions:', error);
		return [];
	}

	return data;
}
export async function getOwnerProfile(ownerId: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('profiles')
		.select()
		.eq('id', ownerId)
		.single();
	if (fetchError) {
		error(500, { message: fetchError.message });
	}
	return data;
}
