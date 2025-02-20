import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { uuidSchema, type UuidSchema } from '../(data)/zod_schema';
import { zod } from 'sveltekit-superforms/adapters';

export async function setStatusReview(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'reviewing' })
		.eq('id', id)
		.select()
		.single();
	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	return { form, opData };
}

export async function setStatusRevision(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'revision' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	return { form, opData };
}

export async function setStatusApproved(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;

	// Begin a Supabase transaction
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'approved' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	// After successful status update, create the accomplishment report
	const copyResult = await createAccomplishmentFromOperationalPlan(supabase, id);

	if (!copyResult.success) {
		// If copying fails, we might want to revert the status update
		// or at least notify the user that the accomplishment report creation failed
		return message(form, {
			status: 'error',
			text: `Operational plan approved but failed to create accomplishment report: ${copyResult.message}`
		});
	}

	return {
		form,
		opData,
		accomplishmentReportId: copyResult.accomplishmentReportId
	};
}

async function createAccomplishmentFromOperationalPlan(
	supabase: SupabaseClient<Database>,
	operationalPlanId: string
): Promise<{ success: boolean; message: string; accomplishmentReportId?: string }> {
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

	try {
		// Create the accomplishment report with the same owner as the operational plan
		const { data: accReport, error: accError } = await supabase
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

		if (accError || !accReport) {
			throw new Error(`Error creating accomplishment report: ${accError?.message}`);
		}

		// Copy headers
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
					accomplishment_report_id: accReport.id,
					title: header.title,
					position: header.position
				})
				.select()
				.single();

			if (accHeaderError || !accHeader) {
				throw new Error(`Error creating accomplishment header: ${accHeaderError?.message}`);
			}

			// Copy annual plans
			const { data: annualPlans, error: annualPlanError } = await supabase
				.from('op_annual_plan')
				.select('*')
				.eq('op_header_id', header.id)
				.order('position');

			if (annualPlanError) {
				throw new Error(`Error fetching annual plans: ${annualPlanError.message}`);
			}

			for (const annualPlan of annualPlans || []) {
				const { data: accAnnualPlan, error: accAnnualPlanError } = await supabase
					.from('accomplishment_annual_plan')
					.insert({
						accomplishment_header_id: accHeader.id,
						description: annualPlan.description,
						position: annualPlan.position
					})
					.select()
					.single();

				if (accAnnualPlanError || !accAnnualPlan) {
					throw new Error(
						`Error creating accomplishment annual plan: ${accAnnualPlanError?.message}`
					);
				}

				// Copy activities
				const { data: activities, error: activityError } = await supabase
					.from('op_activity')
					.select('*')
					.eq('op_annual_plan_id', annualPlan.id)
					.order('position');

				if (activityError) {
					throw new Error(`Error fetching activities: ${activityError.message}`);
				}

				for (const activity of activities || []) {
					const { data: accActivity, error: accActivityError } = await supabase
						.from('accomplishment_activity')
						.insert({
							accomplishment_annual_plan_id: accAnnualPlan.id,
							activity: activity.activity,
							position: activity.position
						})
						.select()
						.single();

					if (accActivityError || !accActivity) {
						throw new Error(`Error creating accomplishment activity: ${accActivityError?.message}`);
					}

					// Copy indicators
					const { data: indicators, error: indicatorError } = await supabase
						.from('op_activity_indicator')
						.select('*')
						.eq('op_activity_id', activity.id)
						.order('position');

					if (indicatorError) {
						throw new Error(`Error fetching indicators: ${indicatorError.message}`);
					}

					for (const indicator of indicators || []) {
						const { data: accIndicator, error: accIndicatorError } = await supabase
							.from('accomplishment_activity_indicator')
							.insert({
								accomplishment_activity_id: accActivity.id,
								input_type: indicator.input_type,
								performance_indicator: indicator.performance_indicator,
								annual_target: indicator.total || '', // Provide empty string if total is null
								responsible_officer_unit: indicator.responsible_officer_unit || '', // Provide empty string if null
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
							throw new Error(
								`Error creating accomplishment indicator: ${accIndicatorError?.message}`
							);
						}
					}
				}
			}
		}

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
