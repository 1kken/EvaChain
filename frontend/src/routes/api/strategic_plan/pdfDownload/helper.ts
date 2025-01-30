import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export async function fetchStrategicPlan(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strategic_plan')
		.select('*')
		.eq('id', id)
		.single();
	if (fetchError) {
		throw error(500, { message: 'Error fetching strategic plan' });
	}
	return data;
}

export async function fetchObjectives(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strat_plan_objective')
		.select('*')
		.eq('strategic_plan_id', id)
		.order('position', { ascending: true });
	if (fetchError) {
		throw error(500, { message: 'Error fetching objectives' });
	}
	return data;
}

export async function fetchStrategyPlans(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strategy_plan')
		.select('*')
		.eq('strat_plan_id', id)
		.order('position', { ascending: true });
	if (fetchError) {
		throw error(500, { message: 'Error fetching strategies' });
	}
	return data;
}

export async function fetchPerformanceIndicators(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strategy_plan_performance_indicator')
		.select('*')
		.eq('strategy_plan_id', id)
		.order('position', { ascending: true });
	if (fetchError) {
		throw error(500, { message: 'Error fetching performance indicators' });
	}
	return data;
}

export async function fetchSdgAlignments(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('sdg_alignment_view')
		.select('*')
		.eq('performance_indicator_id', id)
		.order('performance_indicator_position', { ascending: true });
	if (fetchError) {
		throw error(500, { message: 'Error fetching sdg alignments' + fetchError.message });
	}
	return data;
}

export async function fetchIndicatorYears(id: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('strat_plan_yearly_plan')
		.select('*')
		.eq('strategy_plan_performance_indicator_id', id)
		.order('year', { ascending: true });
	if (fetchError) {
		throw error(500, { message: 'Error fetching indicator years' });
	}
	return data;
}
