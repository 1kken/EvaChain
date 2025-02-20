import type { Database, Tables } from '$lib/types/database.types';
import type { Content, TableCell } from 'pdfmake/interfaces';
import {
	fetchOpActivitiesByOpObjectiveId,
	fetchOpAnnualPlanByOpHeaderId,
	fetchOpHeadersByOPId,
	fetchOpIndicatorsByOpActivityId
} from './op_body_helper';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function generateOpBody(
	op: Tables<'operational_plan'>,
	supabase: SupabaseClient<Database>
): Promise<Content> {
	const ratingWidth = 30;
	const opHeaders = await fetchOpHeadersByOPId(op.id, supabase);
	const cotext: Content = {
		marginTop: 10,
		table: {
			//17 cols
			widths: [
				'*', //annual plan
				'*', //activities
				'*', //performance Indicator
				'auto', //former state
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth,
				ratingWidth, //Target
				'*', // REsponsible officer/units
				'*', // Total budget requirements
				'*'
			],
			headerRows: 1,
			body: [
				[
					{ text: 'Annual Plan', style: 'header' },
					{ text: 'Activities', style: 'header' },
					{ text: 'Performance Indicator', style: 'header' },
					{ text: 'Former State', style: 'header' },
					{
						colSpan: 5,
						stack: [
							{
								text: 'Target',
								style: 'header',
								bold: true,
								alignment: 'center'
							},
							{
								marginTop: 10,
								table: {
									widths: ['*', '*', '*', '*', '*'],
									body: [
										[
											{
												text: [
													{ text: 'Q', style: 'normalText' },
													{ text: '1', sup: true }
												],
												alignment: 'center',
												border: [false, true, true, false]
											},
											{
												text: [
													{ text: 'Q', style: 'normalText' },
													{ text: '2', sup: true }
												],
												alignment: 'center',
												border: [true, true, true, false]
											},
											{
												text: [
													{ text: 'Q', style: 'normalText' },
													{ text: '3', sup: true }
												],
												alignment: 'center',
												border: [true, true, true, false]
											},
											{
												text: [
													{ text: 'Q', style: 'normalText' },
													{ text: '4', sup: true }
												],
												alignment: 'center',
												border: [true, true, false, false]
											},
											{
												text: 'Total',
												alignment: 'center',
												border: [true, true, false, false]
											}
										]
									]
								}
							}
						]
					},
					{},
					{},
					{},
					{},
					{ text: 'Responsible \n Officer/Units', style: 'header' },
					{ text: 'Total Budget \n Requirements', style: 'header' },
					{ text: 'Remarks', style: 'header' }
				],
				...(await main(opHeaders, supabase))
			]
		}
	};

	return cotext;
}

async function main(
	opHeaders: Tables<'op_header'>[],
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];

	for (const opHeader of opHeaders) {
		rows.push(generateOpHeaderRow(opHeader.title));
		//fetch annual plans
		const opAnnualPlans = await fetchOpAnnualPlanByOpHeaderId(opHeader.id, supabase);
		for (const opAnnualPlan of opAnnualPlans) {
			let isFirstAnnualPlan = true;
			const opActivities = await fetchOpActivitiesByOpObjectiveId(opAnnualPlan.id, supabase);
			for (const opActivity of opActivities) {
				let isFirstActivity = true;
				const opIndicators = await fetchOpIndicatorsByOpActivityId(opActivity.id, supabase);
				for (const opIndicator of opIndicators) {
					rows.push([
						{ text: isFirstAnnualPlan ? opAnnualPlan.description : '' },
						{ text: isFirstActivity ? opActivity.activity : '' },
						{ text: opIndicator.performance_indicator },
						{ text: opIndicator.former_state, alignment: 'center' },
						{ text: opIndicator.q1_target, alignment: 'center' },
						{ text: opIndicator.q2_target, alignment: 'center' },
						{ text: opIndicator.q3_target, alignment: 'center' },
						{ text: opIndicator.q4_target, alignment: 'center' },
						{ text: opIndicator.total, alignment: 'center' },
						{ text: opIndicator.responsible_officer_unit, alignment: 'center' },
						{ text: opIndicator.total_budgetary_requirements, alignment: 'center' },
						{ text: opIndicator.remarks ?? '', alignment: 'left' }
					]);
					isFirstActivity = false;
					isFirstAnnualPlan = false;
				}
			}
		}
	}
	return rows;
}

function generateOpHeaderRow(opHeader: string): TableCell[] {
	return [
		{
			text: opHeader,
			colSpan: 12,
			bold: true
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{}
	];
}
