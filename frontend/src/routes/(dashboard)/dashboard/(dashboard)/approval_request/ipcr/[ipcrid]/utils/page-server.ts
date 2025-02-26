import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateIpcrIndicatorSchema } from '../schema/indicator_schema';

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

//fetch ipcr_immediate_supervisor
export async function getImmediateSupervisor(
	ipcrId: string,
	session: Session,
	supabase: SupabaseClient<Database>
) {
	const { data, error: fetchError } = await supabase
		.from('ipcr_immediate_supervisor')
		.select()
		.eq('ipcr_id', ipcrId)
		.single();
	if (fetchError) {
		error(500, { message: fetchError.message });
	}
	return data;
}

//Forms
export async function getIPCRIndicatorForms() {
	return {
		updateForm: await superValidate(zod(updateIpcrIndicatorSchema))
	};
}
