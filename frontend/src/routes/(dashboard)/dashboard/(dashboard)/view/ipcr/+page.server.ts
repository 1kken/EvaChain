import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/types/database.types';

export const load = (async ({ locals }) => {
	const { supabase, hasPermission, profile } = locals;

	let ipcrs: Tables<'ipcr_owner_details'>[] = [];

	//office view
	if (await hasPermission('office_view_ipcr')) {
		if (!profile?.office_id) {
			error(404, 'Office not found');
		}
		const { data } = await supabase
			.from('ipcr_owner_details')
			.select('*')
			.eq('office_id', profile.office_id);
		ipcrs = data || [];
		return { ipcrs };
	}

	//program view
	if (await hasPermission('program_view_ipcr')) {
		if (!profile?.program_id) {
			error(404, 'Program not found');
		}
		const { data } = await supabase
			.from('ipcr_owner_details')
			.select('*')
			.eq('program_id', profile.program_id);
		ipcrs = data || [];
		return { ipcrs };
	}

	//unit view
	if (await hasPermission('unit_view_ipcr')) {
		if (!profile?.unit_id) {
			error(404, 'Unit not found');
		}
		const { data } = await supabase
			.from('ipcr_owner_details')
			.select('*')
			.eq('unit_id', profile.unit_id);
		ipcrs = data || [];
		return { ipcrs };
	}

	return { ipcrs };
}) satisfies PageServerLoad;
