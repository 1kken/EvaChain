import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createStrategyPlanPerformanceIndicatorSchema,
	updateStrategyPlanPerformanceIndicatorSchema,
	type CreateStrategyPlanPerformanceIndicatorSchema,
	type UpdateStrategyPlanPerformanceIndicatorSchema
} from '../schema/performance_indicator_schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { Database } from '$lib/types/database.types';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createPerformanceIndicator(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateStrategyPlanPerformanceIndicatorSchema>,
		App.Superforms.Message
	>(request, zod(createStrategyPlanPerformanceIndicatorSchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const {
		strategy_plan_id,
		performance_indicator,
		input_type,
		base_target,
		actual_target,
		concerned_offices,
		remarks,
		position,
		yearly_plans: yearlyPlan,
		sdg_alignments: sdgAlignments
	} = form.data;

	//save the indicator
	const { data: performanceIndicator, error: performanceIndicatorError } = await supabase
		.from('strategy_plan_performance_indicator')
		.insert({
			strategy_plan_id,
			performance_indicator,
			input_type,
			base_target,
			actual_target,
			concerned_offices,
			position,
			remarks
		})
		.select()
		.single();

	if (performanceIndicatorError) {
		return message(form, {
			status: 'error',
			text: 'Error saving performance indicator'
		});
	}

	//save the sdg
	const { data: sdgData, error: sdgError } = await saveSdgAlignments(
		performanceIndicator?.id,
		sdgAlignments,
		supabase
	);

	if (sdgError) {
		return message(form, {
			status: 'error',
			text: 'Error saving SDG alignment'
		});
	}

	//save the yearly plan
	const { data: yearlyPlanData, error: yearlyPlanError } = await saveYearlyPlans(
		performanceIndicator?.id,
		yearlyPlan,
		supabase
	);

	if (yearlyPlanError) {
		return message(form, {
			status: 'error',
			text: 'Error saving yearly plan'
		});
	}

	return { form, performanceIndicator };
}

interface SdgAlignments {
	strat_plan_objective_id: string;
}
async function saveSdgAlignments(
	indicatorId: string,
	sdgAlignments: SdgAlignments[],
	supabase: SupabaseClient<Database>
) {
	const sdgWithIndicatorId = sdgAlignments.map((sdg) => ({
		strat_plan_performance_indicator_id: indicatorId,
		...sdg
	}));
	const { data, error } = await supabase.from('sdg_alignment').insert(sdgWithIndicatorId);

	return { data, error };
}

interface YearlyPlan {
	budget: number;
	target: string;
	year: number;
}

async function saveYearlyPlans(
	indicatorId: string,
	yearlyPlans: YearlyPlan[],
	supabase: SupabaseClient<Database>
) {
	const yearlyPlansWithIndicatorId = yearlyPlans.map((plan) => ({
		strategy_plan_performance_indicator_id: indicatorId,
		year: plan.year,
		target: plan.target,
		budget: plan.budget
	}));
	const { data, error } = await supabase
		.from('strat_plan_yearly_plan')
		.insert(yearlyPlansWithIndicatorId);

	return { data, error };
}

//======= UPDATE
export async function updatePerformanceIndicator(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateStrategyPlanPerformanceIndicatorSchema>,
		App.Superforms.Message
	>(request, zod(updateStrategyPlanPerformanceIndicatorSchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, yearly_plans, sdg_alignments, ...indicatorData } = form.data;

	// Update performance indicator
	const { data: performanceIndicator, error: updateError } = await supabase
		.from('strategy_plan_performance_indicator')
		.update(indicatorData)
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		return message(form, {
			status: 'error',
			text: 'Error updating performance indicator'
		});
	}

	// Handle yearly plans
	if (yearly_plans) {
		const { error: yearlyPlanError } = await handleYearlyPlans(id, yearly_plans, supabase);
		if (yearlyPlanError) {
			return message(form, {
				status: 'error',
				text: 'Error updating yearly plans '
			});
		}
	}

	// Handle SDG alignments
	if (sdg_alignments) {
		const { error: sdgError } = await handleSdgAlignments(id, sdg_alignments, supabase);
		if (sdgError) {
			return message(form, {
				status: 'error',
				text: 'Error updating SDG alignments'
			});
		}
	}

	return { form, performanceIndicator };
}

async function handleYearlyPlans(
	performanceIndicatorId: string,
	newYearlyPlans: Array<{ year: number; target: string; budget: number }>,
	supabase: SupabaseClient<Database>
) {
	// Fetch existing yearly plans
	const { data: existingPlans, error: fetchError } = await supabase
		.from('strat_plan_yearly_plan')
		.select()
		.eq('strategy_plan_performance_indicator_id', performanceIndicatorId);

	if (fetchError) {
		return { error: fetchError };
	}

	// Prepare yearly plans for upsert
	const plansToUpsert = newYearlyPlans.map((plan) => ({
		strategy_plan_performance_indicator_id: performanceIndicatorId,
		year: plan.year,
		target: plan.target,
		budget: plan.budget
	}));

	if (plansToUpsert.length > 0) {
		const { data, error } = await supabase
			.from('strat_plan_yearly_plan')
			.upsert(plansToUpsert, {
				// Specify the unique constraint to use for upserting
				onConflict: 'strategy_plan_performance_indicator_id,year',
				// Merge the updated fields
				ignoreDuplicates: false
			})
			.select();

		if (error) return { error };

		// Delete any existing plans that aren't in the new set
		if (existingPlans) {
			const yearsToKeep = new Set(newYearlyPlans.map((plan) => plan.year));
			const plansToDelete = existingPlans.filter((plan) => !yearsToKeep.has(plan.year));

			if (plansToDelete.length > 0) {
				const { error: deleteError } = await supabase
					.from('strat_plan_yearly_plan')
					.delete()
					.in(
						'id',
						plansToDelete.map((plan) => plan.id)
					);

				if (deleteError) return { error: deleteError };
			}
		}

		return { data };
	}

	return { data: null };
}

async function handleSdgAlignments(
	performanceIndicatorId: string,
	newAlignments: Array<{ strat_plan_objective_id: string }>,
	supabase: SupabaseClient<Database>
) {
	// Fetch existing alignments
	const { data: existingAlignments, error: fetchError } = await supabase
		.from('sdg_alignment')
		.select()
		.eq('strat_plan_performance_indicator_id', performanceIndicatorId);

	if (fetchError) {
		return { error: fetchError };
	}

	// Prepare alignments for upsert
	const alignmentsToUpsert = newAlignments.map((alignment) => ({
		strat_plan_performance_indicator_id: performanceIndicatorId,
		strat_plan_objective_id: alignment.strat_plan_objective_id
	}));

	if (alignmentsToUpsert.length > 0) {
		const { data, error } = await supabase
			.from('sdg_alignment')
			.upsert(alignmentsToUpsert, {
				onConflict: 'strat_plan_objective_id,strat_plan_performance_indicator_id',
				ignoreDuplicates: false
			})
			.select();

		if (error) return { error };

		// Delete any existing alignments that aren't in the new set
		if (existingAlignments) {
			const objectiveIdsToKeep = new Set(
				newAlignments.map((align) => align.strat_plan_objective_id)
			);

			const alignmentsToDelete = existingAlignments.filter(
				(align) => !objectiveIdsToKeep.has(align.strat_plan_objective_id)
			);

			if (alignmentsToDelete.length > 0) {
				const { error: deleteError } = await supabase
					.from('sdg_alignment')
					.delete()
					.in(
						'id',
						alignmentsToDelete.map((align) => align.id)
					);

				if (deleteError) return { error: deleteError };
			}
		}

		return { data };
	}

	return { data: null };
}
//======= DELETE
export async function deleteIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UniversalDeleteSchema>, App.Superforms.Message>(
		request,
		zod(universalDeleteSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id } = form.data;

	const { data: performanceIndicator, error: indicatorError } = await supabase
		.from('strategy_plan_performance_indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (indicatorError) {
		return message(form, {
			status: 'error',
			text: `Error deleting performance indicator, ${indicatorError.message}`
		});
	}

	return { form, performanceIndicator };
}
