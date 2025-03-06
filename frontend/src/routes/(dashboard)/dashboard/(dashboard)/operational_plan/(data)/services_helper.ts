import type { Database, Tables } from '$lib/types/database.types';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

type ProfileResult = {
	data?: Tables<'profiles'> | null;
	error?: PostgrestError | null;
};

export async function fetchProfileDetails(
	id: string,
	supabase: SupabaseClient<Database>
): Promise<ProfileResult> {
	const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
	return { data, error };
}

async function getLatestOperationalPlan(
	supabase: SupabaseClient<Database>,
	unit_id: number | null,
	office_id: number | null,
	program_id: number | null
) {
	let query = supabase
		.from('operational_plan')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(1);

	if (program_id) {
		query = query.eq('program_id', program_id);
	} else if (office_id) {
		query = query.eq('office_id', office_id);
	} else if (unit_id) {
		query = query.eq('unit_id', unit_id);
	}

	const { data: plans, error } = await query;

	if (error) throw new Error('Error fetching operational plans');
	if (!plans?.length) throw new Error('No previous operational plan found');

	return plans[0];
}

async function copyOperationalPlan(
	supabase: SupabaseClient<Database>,
	previousOpId: string,
	newOpData: NewOpData
) {
	// Create new operational plan
	const { data: newOp, error: opError } = await supabase
		.from('operational_plan')
		.insert(newOpData)
		.select()
		.single();

	if (opError || !newOp) throw new Error('Failed to create new operational plan');

	// Fetch existing structure with activities and indicators
	const { data: headers, error: headerError } = await supabase
		.from('op_header')
		.select(
			`
            id,
            title,
            position,
            op_annual_plan (
                id,
                description,
                position,
                op_activity (
                    id,
                    activity,
                    position,
                    op_activity_indicator (
                        id,
                        input_type,
                        performance_indicator,
                        former_state,
                        q1_target,
                        q2_target,
                        q3_target,
                        q4_target,
                        total,
                        responsible_officer_unit,
                        total_budgetary_requirements,
                        position
                    )
                )
            )
        `
		)
		.eq('operational_plan_id', previousOpId)
		.order('position');

	if (headerError || !headers) throw new Error('Failed to fetch headers');

	// Copy the structure
	for (const header of headers) {
		// Create new header
		const { data: newHeader, error: newHeaderError } = await supabase
			.from('op_header')
			.insert({
				operational_plan_id: newOp.id,
				title: header.title,
				position: header.position
			})
			.select()
			.single();

		if (newHeaderError || !newHeader) throw new Error('Failed to create header');

		// Copy annual plans and their activities/indicators
		for (const annualPlan of header.op_annual_plan) {
			const { data: newAnnualPlan, error: annualPlanError } = await supabase
				.from('op_annual_plan')
				.insert({
					op_header_id: newHeader.id,
					description: annualPlan.description,
					position: annualPlan.position
				})
				.select()
				.single();

			if (annualPlanError || !newAnnualPlan) throw new Error('Failed to create annual plan');

			// Copy activities
			for (const activity of annualPlan.op_activity) {
				// Create new activity
				const { data: newActivity, error: activityError } = await supabase
					.from('op_activity')
					.insert({
						op_annual_plan_id: newAnnualPlan.id,
						activity: activity.activity,
						position: activity.position
					})
					.select()
					.single();

				if (activityError || !newActivity) throw new Error('Failed to create activity');

				// Copy indicators for this activity
				const indicators = activity.op_activity_indicator.map((indicator) => ({
					op_activity_id: newActivity.id,
					input_type: indicator.input_type,
					performance_indicator: indicator.performance_indicator,
					former_state: indicator.total ?? 'undefined',
					q1_target: null, // Reset targets for new plan
					q2_target: null,
					q3_target: null,
					q4_target: null,
					total: null,
					responsible_officer_unit: indicator.responsible_officer_unit,
					total_budgetary_requirements: indicator.total_budgetary_requirements,
					position: indicator.position
				}));

				if (indicators.length > 0) {
					const { error: indicatorsError } = await supabase
						.from('op_activity_indicator')
						.insert(indicators);

					if (indicatorsError) throw new Error('Failed to create indicators');
				}
			}
		}
	}

	return newOp.id;
}

type NewOpData = {
	title: string;
	implementing_unit: string;
	review_by: string;
	reviewer_position: string;
	approve_by: string;
	approver_position: string;
	unit_id: number;
	office_id?: number | null;
	program_id?: number | null;
	creator_id: string;
};

export async function checkExistingOplanThisYear(
	supabase: SupabaseClient<Database>,
	unit_id: number | null,
	office_id: number | null,
	program_id: number | null
) {
	const currentYear = new Date().getFullYear();
	let query = supabase.from('operational_plan').select('*');

	if (program_id) {
		query = query.eq('program_id', program_id);
	} else if (office_id) {
		query = query.eq('office_id', office_id);
	} else if (unit_id) {
		query = query.eq('unit_id', unit_id);
	}

	const { data: existingPlans } = await query;
	const currentYearPlans = existingPlans?.filter(
		(plan) => new Date(plan.created_at).getFullYear() === currentYear
	);

	if (currentYearPlans?.length) {
		const scope = program_id ? 'program' : office_id ? 'office' : 'unit';
		throw new Error(
			`An operational plan for ${currentYear} already exists at your ${scope} level.`
		);
	}
}
export async function checkAndCopyOperationalPlan(
	supabase: SupabaseClient<Database>,
	newOpData: NewOpData
) {
	try {
		checkExistingOplanThisYear(
			supabase,
			newOpData.unit_id,
			newOpData.office_id!,
			newOpData.program_id!
		);

		const latestPlan = await getLatestOperationalPlan(
			supabase,
			newOpData.unit_id,
			newOpData.office_id!,
			newOpData.program_id!
		);

		const newPlanId = await copyOperationalPlan(supabase, latestPlan.id, newOpData);

		return { success: true, id: newPlanId };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
