import type { Database } from '$lib/types/database.types';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

type SupabaseClientType = SupabaseClient<Database>;

interface GenerateOPCROptions {
	strategicPlanId: string;
	userId: string;
}

interface GenerateOPCRResult {
	opcrId: string | null;
	error: PostgrestError | Error | null;
}

export async function fetchStrategicPlan(supabase: SupabaseClientType, strategicPlanId: string) {
	return await supabase
		.from('strategic_plan')
		.select('*, title, unit_id, office_id, program_id, owner_id')
		.eq('id', strategicPlanId)
		.single();
}

export async function createOPCR(supabase: SupabaseClientType, strategicPlan: any, userId: string) {
	return await supabase
		.from('opcr')
		.insert({
			title: strategicPlan.title,
			review_by: 'Juan De La Cruz',
			reviewer_position: 'Juan De La Cruz',
			administrative_officer: 'Juan De La Cruz',
			planning_officer: 'Juan De La Cruz',
			human_resource: 'Juan De La Cruz',
			owner_id: userId,
			unit_id: strategicPlan.unit_id,
			office_id: strategicPlan.office_id,
			program_id: strategicPlan.program_id
		})
		.select('id')
		.single();
}

export async function createCoreFunction(supabase: SupabaseClientType, opcrId: string) {
	return await supabase
		.from('opcr_function')
		.insert({
			opcr_id: opcrId,
			title: 'Core Function',
			position: 1
		})
		.select('id')
		.single();
}

export async function fetchStrategyPlans(supabase: SupabaseClientType, strategicPlanId: string) {
	return await supabase
		.from('strategy_plan')
		.select('id, description, position')
		.eq('strat_plan_id', strategicPlanId)
		.order('position');
}

export async function createFunctionCategory(
	supabase: SupabaseClientType,
	coreFunctionId: string,
	strategyPlanDescription: string,
	position: number
) {
	return await supabase
		.from('opcr_function_category')
		.insert({
			opcr_function_id: coreFunctionId,
			category: strategyPlanDescription,
			position: position
		})
		.select('id')
		.single();
}

export async function fetchStrategyPlanIndicators(
	supabase: SupabaseClientType,
	strategyPlanId: string
) {
	return await supabase
		.from('strategy_plan_performance_indicator')
		.select('id, performance_indicator, position')
		.eq('strategy_plan_id', strategyPlanId)
		.order('position');
}

export async function createOPCRIndicator(
	supabase: SupabaseClientType,
	categoryId: string,
	performanceIndicator: string,
	position: number
) {
	return await supabase.from('opcr_indicator').insert({
		opcr_function_category_id: categoryId,
		success_indicator: performanceIndicator,
		position: position,
		// Empty fields as specified
		alloted_budget: null,
		division_individuals_accountable: null,
		actual_accomplishments: null,
		quality_rating: null,
		efficiency_rating: null,
		timeliness_rating: null,
		average_rating: null,
		remarks: null
	});
}

export async function generateOPCRFromStrategicPlan(
	supabase: SupabaseClientType,
	options: GenerateOPCROptions
): Promise<GenerateOPCRResult> {
	const { strategicPlanId, userId } = options;

	try {
		// Step 1: Fetch the strategic plan details
		const { data: strategicPlan, error: spError } = await fetchStrategicPlan(
			supabase,
			strategicPlanId
		);

		if (spError || !strategicPlan) {
			return { opcrId: null, error: spError || new Error('Strategic plan not found') };
		}

		// Step 2: Create the OPCR
		const { data: opcr, error: opcrError } = await createOPCR(supabase, strategicPlan, userId);

		if (opcrError || !opcr) {
			return { opcrId: null, error: opcrError || new Error('Failed to create OPCR') };
		}

		// Step 3: Create a single "Core Function" opcr_function
		const { data: coreFunction, error: functionError } = await createCoreFunction(
			supabase,
			opcr.id
		);

		if (functionError || !coreFunction) {
			return { opcrId: null, error: functionError || new Error('Failed to create core function') };
		}

		// Step 4: Fetch all strategy plans from the strategic plan
		const { data: strategyPlans, error: strategyPlansError } = await fetchStrategyPlans(
			supabase,
			strategicPlanId
		);

		if (strategyPlansError || !strategyPlans) {
			return {
				opcrId: null,
				error: strategyPlansError || new Error('Failed to fetch strategy plans')
			};
		}

		// Step 5: Create opcr_function_category entries from strategy plans and their indicators
		for (let i = 0; i < strategyPlans.length; i++) {
			const strategyPlan = strategyPlans[i];

			const { data: category, error: categoryError } = await createFunctionCategory(
				supabase,
				coreFunction.id,
				strategyPlan.description,
				i + 1
			);

			if (categoryError || !category) {
				return {
					opcrId: null,
					error: categoryError || new Error('Failed to create function category')
				};
			}

			// Step 6: Fetch all indicators for this strategy plan
			const { data: indicators, error: indicatorsError } = await fetchStrategyPlanIndicators(
				supabase,
				strategyPlan.id
			);

			if (indicatorsError || !indicators) {
				return { opcrId: null, error: indicatorsError || new Error('Failed to fetch indicators') };
			}

			// Step 7: Create opcr_indicator entries for each strategy_plan_performance_indicator
			for (let j = 0; j < indicators.length; j++) {
				const indicator = indicators[j];

				// Skip any null indicators or missing performance indicators
				if (!indicator.id || !indicator.performance_indicator) continue;

				const { error: indicatorError } = await createOPCRIndicator(
					supabase,
					category.id,
					indicator.performance_indicator,
					j + 1
				);

				if (indicatorError) {
					return { opcrId: null, error: indicatorError };
				}
			}
		}

		return { opcrId: opcr.id, error: null };
	} catch (error) {
		throw error;
		// return {
		// 	opcrId: null,
		// 	error: error instanceof Error ? error : new Error('Unknown error occurred')
		// };
	}
}
