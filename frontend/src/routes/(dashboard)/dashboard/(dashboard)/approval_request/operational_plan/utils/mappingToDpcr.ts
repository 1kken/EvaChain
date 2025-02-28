import type { Database } from '$lib/types/database.types';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
type SupabaseClientType = SupabaseClient<Database>;

interface GenerateDPCROptions {
	operationalPlanId: string;
	userId: string;
}

interface GenerateDPCRResult {
	dpcrId: string | null;
	error: PostgrestError | Error | null;
}

export async function fetchOperationalPlan(
	supabase: SupabaseClientType,
	operationalPlanId: string
) {
	return await supabase
		.from('operational_plan')
		.select('*, creator_id, title, unit_id, office_id, program_id')
		.eq('id', operationalPlanId)
		.single();
}

export async function createDPCR(
	supabase: SupabaseClientType,
	operationalPlan: any,
	userId: string
) {
	return await supabase
		.from('dpcr')
		.insert({
			title: 'Generated Dpcr' + ' ' + new Date().getFullYear(),
			review_by: '',
			reviewer_position: '',
			owner_id: userId,
			unit_id: operationalPlan.unit_id,
			office_id: operationalPlan.office_id,
			program_id: operationalPlan.program_id
		})
		.select('id')
		.single();
}

export async function createCoreFunction(supabase: SupabaseClientType, dpcrId: string) {
	return await supabase
		.from('dpcr_function')
		.insert({
			dpcr_id: dpcrId,
			title: 'Core function',
			position: 1
		})
		.select('id')
		.single();
}

export async function fetchOperationalPlanHeaders(
	supabase: SupabaseClientType,
	operationalPlanId: string
) {
	return await supabase
		.from('op_header')
		.select('id, title, position')
		.eq('operational_plan_id', operationalPlanId)
		.order('position');
}

export async function createFunctionCategory(
	supabase: SupabaseClientType,
	coreFunctionId: string,
	headerTitle: string,
	position: number
) {
	return await supabase
		.from('dpcr_function_category')
		.insert({
			dpcr_function_id: coreFunctionId,
			category: headerTitle,
			position: position
		})
		.select('id')
		.single();
}

export async function fetchHeaderIndicators(supabase: SupabaseClientType, headerId: string) {
	return await supabase.from('op_header_indicators').select('*').eq('header_id', headerId);
}

export async function createDPCRIndicator(
	supabase: SupabaseClientType,
	categoryId: string,
	performanceIndicator: string,
	position: number
) {
	return await supabase.from('dpcr_indicator').insert({
		dpcr_function_category_id: categoryId,
		success_indicator: performanceIndicator,
		position: position,
		alloted_budget: null,
		division_individuals_accountable: null,
		physical_targets: null,
		actual_accomplishments: null,
		quality_rating: null,
		efficiency_rating: null,
		timeliness_rating: null,
		average_rating: null,
		remarks: null
	});
}

export async function generateDPCRFromOperationalPlan(
	supabase: SupabaseClientType,
	options: GenerateDPCROptions
): Promise<GenerateDPCRResult> {
	const { operationalPlanId, userId } = options;

	try {
		// Step 1: Fetch the operational plan details
		const { data: operationalPlan, error: opError } = await fetchOperationalPlan(
			supabase,
			operationalPlanId
		);

		if (opError || !operationalPlan) {
			return { dpcrId: null, error: opError || new Error('Operational plan not found') };
		}

		// Step 2: Create the DPCR
		const { data: dpcr, error: dpcrError } = await createDPCR(supabase, operationalPlan, userId);

		if (dpcrError || !dpcr) {
			return { dpcrId: null, error: dpcrError || new Error('Failed to create DPCR') };
		}

		// Step 3: Create a single "Core function" dpcr_function
		const { data: coreFunction, error: functionError } = await createCoreFunction(
			supabase,
			dpcr.id
		);

		if (functionError || !coreFunction) {
			return { dpcrId: null, error: functionError || new Error('Failed to create core function') };
		}

		// Step 4: Fetch all headers from the operational plan
		const { data: headers, error: headersError } = await fetchOperationalPlanHeaders(
			supabase,
			operationalPlanId
		);

		if (headersError || !headers) {
			return { dpcrId: null, error: headersError || new Error('Failed to fetch headers') };
		}

		// Step 5: Create dpcr_function_category entries from op_headers and their indicators
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i];

			const { data: category, error: categoryError } = await createFunctionCategory(
				supabase,
				coreFunction.id,
				header.title,
				i + 1
			);

			if (categoryError || !category) {
				return {
					dpcrId: null,
					error: categoryError || new Error('Failed to create function category')
				};
			}

			// Step 6: Fetch all indicators for this header through the hierarchy
			const { data: indicators, error: indicatorsError } = await fetchHeaderIndicators(
				supabase,
				header.id
			);

			if (indicatorsError || !indicators) {
				return { dpcrId: null, error: indicatorsError || new Error('Failed to fetch indicators') };
			}

			// Step 7: Create dpcr_indicator entries for each op_activity_indicator
			for (let j = 0; j < indicators.length; j++) {
				const indicator = indicators[j];

				// Skip any null indicators (in case the view returns some rows without indicators)
				if (!indicator.indicator_id || !indicator.performance_indicator) continue;

				const { error: indicatorError } = await createDPCRIndicator(
					supabase,
					category.id,
					indicator.performance_indicator,
					j + 1
				);

				if (indicatorError) {
					return { dpcrId: null, error: indicatorError };
				}
			}
		}

		return { dpcrId: dpcr.id, error: null };
	} catch (error) {
		return {
			dpcrId: null,
			error: error instanceof Error ? error : new Error('Unknown error occurred')
		};
	}
}
