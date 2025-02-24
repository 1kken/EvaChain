import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
interface CreateAccomplishmentResult {
	success: boolean;
	message: string;
	accomplishmentReportId?: string;
}

interface OperationalPlanData {
	id: string;
	title: string;
	implementing_unit: string;
	review_by: string;
	reviewer_position: string;
	approve_by: string;
	approver_position: string;
	creator_id: string;
	unit_id: number;
	office_id: number | null;
	program_id: number | null;
}

async function createAccomplishmentHeaders(
	supabase: SupabaseClient<Database>,
	operationalPlanId: string,
	accomplishmentReportId: string
): Promise<void> {
	const { data: headers, error: headerError } = await supabase
		.from('op_header')
		.select('*')
		.eq('operational_plan_id', operationalPlanId)
		.order('position');

	if (headerError) {
		throw new Error(`Error fetching headers: ${headerError.message}`);
	}

	for (const header of headers || []) {
		const { data: accHeader, error: accHeaderError } = await supabase
			.from('accomplishment_header')
			.insert({
				accomplishment_report_id: accomplishmentReportId,
				title: header.title,
				position: header.position
			})
			.select()
			.single();

		if (accHeaderError || !accHeader) {
			throw new Error(`Error creating accomplishment header: ${accHeaderError?.message}`);
		}

		await createAnnualPlans(
			supabase,
			header.id,
			accHeader.id,
			operationalPlanId,
			accomplishmentReportId
		);
	}
}

// Add operationalPlanId and accomplishmentReportId parameters
async function createAnnualPlans(
	supabase: SupabaseClient<Database>,
	opHeaderId: string,
	accHeaderId: string,
	operationalPlanId: string,
	accomplishmentReportId: string
): Promise<void> {
	const { data: annualPlans, error: annualPlanError } = await supabase
		.from('op_annual_plan')
		.select('*')
		.eq('op_header_id', opHeaderId)
		.order('position');

	if (annualPlanError) {
		throw new Error(`Error fetching annual plans: ${annualPlanError.message}`);
	}

	for (const annualPlan of annualPlans || []) {
		const { data: accAnnualPlan, error: accAnnualPlanError } = await supabase
			.from('accomplishment_annual_plan')
			.insert({
				accomplishment_header_id: accHeaderId,
				description: annualPlan.description,
				position: annualPlan.position
			})
			.select()
			.single();

		if (accAnnualPlanError || !accAnnualPlan) {
			throw new Error(`Error creating accomplishment annual plan: ${accAnnualPlanError?.message}`);
		}

		await createActivities(
			supabase,
			annualPlan.id,
			accAnnualPlan.id,
			operationalPlanId,
			accomplishmentReportId
		);
	}
}

// Add operationalPlanId and accomplishmentReportId parameters
async function createActivities(
	supabase: SupabaseClient<Database>,
	opAnnualPlanId: string,
	accAnnualPlanId: string,
	operationalPlanId: string,
	accomplishmentReportId: string
): Promise<void> {
	const { data: activities, error: activityError } = await supabase
		.from('op_activity')
		.select('*')
		.eq('op_annual_plan_id', opAnnualPlanId)
		.order('position');

	if (activityError) {
		throw new Error(`Error fetching activities: ${activityError.message}`);
	}

	for (const activity of activities || []) {
		const { data: accActivity, error: accActivityError } = await supabase
			.from('accomplishment_activity')
			.insert({
				accomplishment_annual_plan_id: accAnnualPlanId,
				activity: activity.activity,
				position: activity.position
			})
			.select()
			.single();

		if (accActivityError || !accActivity) {
			throw new Error(`Error creating accomplishment activity: ${accActivityError?.message}`);
		}

		await createIndicators(
			supabase,
			activity.id,
			accActivity.id,
			operationalPlanId,
			accomplishmentReportId
		);
	}
}

// Create indicators for each activity and store mappings
async function createIndicators(
	supabase: SupabaseClient<Database>,
	opActivityId: string,
	accActivityId: string,
	operationalPlanId: string,
	accomplishmentReportId: string
): Promise<void> {
	const { data: indicators, error: indicatorError } = await supabase
		.from('op_activity_indicator')
		.select('*')
		.eq('op_activity_id', opActivityId)
		.order('position');

	if (indicatorError) {
		throw new Error(`Error fetching indicators: ${indicatorError.message}`);
	}

	for (const indicator of indicators || []) {
		// Create accomplishment indicator
		const { data: accIndicator, error: accIndicatorError } = await supabase
			.from('accomplishment_activity_indicator')
			.insert({
				accomplishment_activity_id: accActivityId,
				input_type: indicator.input_type,
				performance_indicator: indicator.performance_indicator,
				annual_target: indicator.total || '',
				responsible_officer_unit: indicator.responsible_officer_unit || '',
				position: indicator.position,
				q1_accomplishment: null,
				q2_accomplishment: null,
				q3_accomplishment: null,
				q4_accomplishment: null,
				total: null,
				accomplishment_rate: null,
				remarks: null
			})
			.select()
			.single();

		if (accIndicatorError || !accIndicator) {
			throw new Error(`Error creating accomplishment indicator: ${accIndicatorError?.message}`);
		}

		// Store the mapping
		await storeIndicatorMapping(
			supabase,
			operationalPlanId,
			accomplishmentReportId,
			indicator.id,
			accIndicator.id
		);
	}
}

// Create the main accomplishment report
async function createAccomplishmentReport(
	supabase: SupabaseClient<Database>,
	opData: OperationalPlanData
): Promise<{ data: any; error: any }> {
	return await supabase
		.from('accomplishment_report')
		.insert({
			title: opData.title,
			implementing_unit: opData.implementing_unit,
			review_by: opData.review_by,
			reviewer_position: opData.reviewer_position,
			approve_by: opData.approve_by,
			approver_position: opData.approver_position,
			owner_id: opData.creator_id,
			unit_id: opData.unit_id,
			office_id: opData.office_id,
			program_id: opData.program_id
		})
		.select()
		.single();
}

// Store the mapping between operational plan and accomplishment report indicators
async function storeIndicatorMapping(
	supabase: SupabaseClient<Database>,
	operationalPlanId: string,
	accomplishmentReportId: string,
	opIndicatorId: string,
	accIndicatorId: string
): Promise<void> {
	const { error: mappingError } = await supabase.from('op_acc_indicators').insert({
		operational_plan_id: operationalPlanId,
		accomplishment_report_id: accomplishmentReportId,
		op_activity_indicator_id: opIndicatorId,
		accomplishment_activity_indicator_id: accIndicatorId
	});

	if (mappingError) {
		throw new Error(`Error creating indicator mapping: ${mappingError.message}`);
	}
}

// Main function that orchestrates the entire process
export async function createAccomplishmentFromOperationalPlan(
	supabase: SupabaseClient<Database>,
	operationalPlanId: string
): Promise<CreateAccomplishmentResult> {
	try {
		// Fetch operational plan data
		const { data: opData, error: opError } = await supabase
			.from('operational_plan')
			.select('*')
			.eq('id', operationalPlanId)
			.single();

		if (opError || !opData) {
			return {
				success: false,
				message: `Error fetching operational plan: ${opError?.message || 'Not found'}`
			};
		}

		// Create the accomplishment report
		const { data: accReport, error: accError } = await createAccomplishmentReport(supabase, opData);

		if (accError || !accReport) {
			throw new Error(`Error creating accomplishment report: ${accError?.message}`);
		}

		// Create the hierarchy
		await createAccomplishmentHeaders(supabase, operationalPlanId, accReport.id);

		return {
			success: true,
			message: 'Successfully copied operational plan to accomplishment report',
			accomplishmentReportId: accReport.id
		};
	} catch (error) {
		return {
			success: false,
			message: `Error during copy process: ${(error as Error).message}`
		};
	}
}
