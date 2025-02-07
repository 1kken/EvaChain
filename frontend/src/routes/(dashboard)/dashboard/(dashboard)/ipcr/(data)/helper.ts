import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export async function getOperationalPlanId(
	session: Session | null,
	supabase: SupabaseClient<Database>
) {
	//get the profile by session.user.id
	if (!session) {
		return error(401, 'Unauthorized');
	}

	const { data, error: profileError } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session.user.id)
		.single();
	if (profileError) {
		error(401, 'Unauthorized');
	}

	if (data.office_id == null) {
		return null;
	}

	//fetch operational plan id
	const { data: operationalPlan, error: operationalPlanError } = await supabase
		.from('operational_plan')
		.select('id')
		.eq('office_id', data.office_id)
		.limit(1)
		.single();
	if (operationalPlanError) {
		console.error(operationalPlanError);
		return null;
	}

	return operationalPlan.id;
}
