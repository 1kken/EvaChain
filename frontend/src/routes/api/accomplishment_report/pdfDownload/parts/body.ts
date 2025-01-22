import type { Database, Tables } from '$lib/types/database.types';
import type { Content, TableCell } from 'pdfmake/interfaces';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
	fetchAccomplishmentHeadersById,
	fetchActivitiesByAnnualPlanId,
	fetchAnnualPlanByHeadersId
} from '../helper';

export async function generateBody(
	accReport: Tables<'accomplishment_report'>,
	supabase: SupabaseClient<Database>
): Promise<Content> {
	const ratingWidth = 30;
	const MARGIN_TOP_DEFAULT = 15;
	const accHeaders = await fetchAccomplishmentHeadersById(accReport.id, supabase);
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
				'*' //remarks
			],
			headerRows: 1,
			body: [
				[
					{ text: 'Annual Plan', style: 'header', marginTop: MARGIN_TOP_DEFAULT },
					{ text: 'Activities', style: 'header', marginTop: MARGIN_TOP_DEFAULT },
					{ text: 'Performance Indicator', style: 'header', marginTop: MARGIN_TOP_DEFAULT },
					{ text: 'Annual Target', style: 'header', marginTop: MARGIN_TOP_DEFAULT },
					{
						colSpan: 5,
						stack: [
							{
								text: 'Accomplishment',
								style: 'header',
								bold: true,
								alignment: 'center',
								marginTop: MARGIN_TOP_DEFAULT - 2
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
					{ text: 'Accomplishment \n Rate', style: 'header', marginTop: MARGIN_TOP_DEFAULT - 3 },
					{
						text: 'Responsible \n Officer/Units',
						style: 'header',
						marginTop: MARGIN_TOP_DEFAULT - 3
					},
					{ text: 'Remarks', style: 'header', marginTop: MARGIN_TOP_DEFAULT }
				],
				...(await main(accHeaders, supabase))
			]
		}
	};

	return cotext;
}

async function main(
	accHeaders: Tables<'accomplishment_header'>[],
	supabase: SupabaseClient<Database>
): Promise<TableCell[][]> {
	const rows: TableCell[][] = [];
	for (const accHeader of accHeaders) {
		rows.push(generateOpHeaderRow(accHeader.title));
		//fetch annual plans
		const annualPlans = await fetchAnnualPlanByHeadersId(accHeader.id, supabase);
		for (const annualPlan of annualPlans) {
			let isFirstAnnualPlan = true;
			const activities = await fetchActivitiesByAnnualPlanId(annualPlan.id, supabase);
			for (const activity of activities) {
				rows.push(
					generateBodyRow({
						isFirstAnnualPlan,
						annualPlansDescription: annualPlan.description,
						activity: activity
					})
				);
				isFirstAnnualPlan = false;
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

interface BodyRowParams {
	isFirstAnnualPlan: boolean;
	annualPlansDescription: string;
	activity: Tables<'accomplishment_activity'>;
}
function generateBodyRow(params: BodyRowParams): TableCell[] {
	return [
		{ text: params.isFirstAnnualPlan ? params.annualPlansDescription : '' },
		{ text: params.activity.activity },
		{
			text: params.activity.performance_indicator
		},
		{
			text: params.activity.annual_target,
			alignment: 'center'
		},
		{ text: params.activity.q1_accomplishment, alignment: 'center' },
		{ text: params.activity.q2_accomplishment, alignment: 'center' },
		{ text: params.activity.q3_accomplishment, alignment: 'center' },
		{ text: params.activity.q4_accomplishment, alignment: 'center' },
		{ text: params.activity.total, alignment: 'center' },
		{ text: params.activity.accomplishment_rate, alignment: 'center' },
		{ text: params.activity.responsible_officer_unit },
		{ text: params.activity.remarks }
	];
}
